import { telemetryStore } from './telemetryService';
import { prisma } from '../config/db';

export interface ExternalTransitConfig {
  feedUrl: string;
  apiKey?: string;
  feedType: 'GTFS_RT_JSON' | 'REST_VEHICLES' | 'CUSTOM_POLLING';
  pollingIntervalSeconds: number;
  enabled: boolean;
  lastSyncAt?: string;
  lastSyncStatus?: 'SUCCESS' | 'ERROR' | 'IDLE';
  lastVehiclesCount?: number;
  lastError?: string;
}

class ExternalTransitConnector {
  private config: ExternalTransitConfig = {
    feedUrl: process.env.GTFS_RT_FEED_URL || 'https://api.chalo.com/v1/public/visakhapatnam/vehicles',
    apiKey: process.env.TRANSIT_API_KEY || '',
    feedType: 'REST_VEHICLES',
    pollingIntervalSeconds: 10,
    enabled: false,
    lastSyncStatus: 'IDLE',
    lastVehiclesCount: 0
  };

  private pollingTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (this.config.enabled) {
      this.startPolling();
    }
  }

  public getConfig(): ExternalTransitConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ExternalTransitConfig>): ExternalTransitConfig {
    this.config = { ...this.config, ...newConfig };
    
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }

    if (this.config.enabled) {
      this.startPolling();
    }

    return this.getConfig();
  }

  private startPolling() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    // Initial sync
    this.pollExternalFeed().catch(console.error);

    const intervalMs = Math.max(5000, (this.config.pollingIntervalSeconds || 10) * 1000);
    this.pollingTimer = setInterval(() => {
      this.pollExternalFeed().catch(console.error);
    }, intervalMs);
  }

  // Poll real-world external transit API
  public async pollExternalFeed(): Promise<{ success: boolean; count: number; message: string }> {
    if (!this.config.feedUrl) {
      return { success: false, count: 0, message: 'No Feed URL configured' };
    }

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'User-Agent': 'APSMART-Transit-Connector/1.0'
      };

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        headers['x-api-key'] = this.config.apiKey;
      }

      const response = await fetch(this.config.feedUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      const vehicles = Array.isArray(data) ? data : data.vehicles || data.entity || [];
      let ingestedCount = 0;

      for (const item of vehicles) {
        const busNumber = item.busNumber || item.vehicle_id || item.id || `BUS-${item.trip_id}`;
        const lat = parseFloat(item.lat || item.latitude || item.position?.latitude);
        const lng = parseFloat(item.lng || item.longitude || item.position?.longitude);
        const speed = parseFloat(item.speed || item.position?.speed || 28.0);
        const heading = parseFloat(item.heading || item.bearing || item.position?.bearing || 0);

        if (!isNaN(lat) && !isNaN(lng)) {
          await telemetryStore.ingestPing({
            busNumber,
            lat,
            lng,
            speed,
            heading,
            accuracyMeters: 5,
            source: 'GTFS_RT'
          });
          ingestedCount++;
        }
      }

      this.config.lastSyncAt = new Date().toISOString();
      this.config.lastSyncStatus = 'SUCCESS';
      this.config.lastVehiclesCount = ingestedCount;
      this.config.lastError = undefined;

      return {
        success: true,
        count: ingestedCount,
        message: `Successfully synchronized ${ingestedCount} live vehicles from external transit feed.`
      };
    } catch (err: any) {
      console.warn('External Transit API fetch warning:', err.message);
      this.config.lastSyncAt = new Date().toISOString();
      this.config.lastSyncStatus = 'ERROR';
      this.config.lastError = err.message;

      return {
        success: false,
        count: 0,
        message: `Failed to poll external transit feed: ${err.message}`
      };
    }
  }
}

export const externalTransitConnector = new ExternalTransitConnector();
