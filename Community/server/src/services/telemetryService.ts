import { prisma } from '../config/db';

export interface TelemetryPing {
  busId?: string;
  busNumber: string;
  lat: number;
  lng: number;
  speed: number; // in km/h
  heading?: number; // 0 - 360 degrees
  accuracyMeters?: number;
  occupancyStatus?: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  driverName?: string;
  source?: 'DRIVER_APP' | 'AIS140_IOT' | 'GTFS_RT' | 'SIMULATION';
  timestamp?: number;
}

export interface StoredTelemetry extends TelemetryPing {
  id: string;
  timestamp: number;
  lastPingAgoSeconds: number;
  gpsSignal: 'STRONG' | 'FAIR' | 'STALE' | 'OFFLINE';
  nextStopId?: string;
  nextStopName?: string;
  distanceToNextStopMeters?: number;
  nextStopEtaMins?: number;
  passedStopsCount?: number;
}

// In-memory high-throughput telemetry cache
class TelemetryStore {
  private pings: Map<string, StoredTelemetry> = new Map(); // keyed by busNumber
  private totalPingsIngested: number = 0;
  private lastFlushAt: number = Date.now();

  constructor() {
    // Background task: clean stale entries or update lastPingAgoSeconds every 2 seconds
    setInterval(() => {
      this.updateSignalAges();
    }, 2000);
  }

  private updateSignalAges() {
    const now = Date.now();
    for (const [busNumber, item] of this.pings.entries()) {
      const ageSec = Math.round((now - item.timestamp) / 1000);
      item.lastPingAgoSeconds = ageSec;

      if (ageSec < 20) {
        item.gpsSignal = 'STRONG';
      } else if (ageSec < 60) {
        item.gpsSignal = 'FAIR';
      } else if (ageSec < 180) {
        item.gpsSignal = 'STALE';
      } else {
        item.gpsSignal = 'OFFLINE';
      }
    }
  }

  // Calculate distance between two lat/lng points using Haversine formula (in meters)
  public calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  // Ingest a real-world GPS ping from a Driver App, IoT Tracker, or GTFS-RT feed
  public async ingestPing(ping: TelemetryPing): Promise<StoredTelemetry> {
    const now = Date.now();
    this.totalPingsIngested++;

    // Find the bus in SQLite to map to its assigned route and stops
    const bus = await prisma.bus.findFirst({
      where: {
        OR: [
          ...(ping.busId ? [{ id: ping.busId }] : []),
          { busNumber: ping.busNumber }
        ]
      },
      include: {
        currentRoute: {
          include: {
            routeStops: {
              include: { stop: true },
              orderBy: { sequenceOrder: 'asc' }
            }
          }
        }
      }
    });

    let nextStopId: string | undefined = undefined;
    let nextStopName: string | undefined = 'Central RTC Complex';
    let distanceToNextStopMeters: number = 450;
    let nextStopEtaMins: number = 3;
    let passedStopsCount: number = 1;

    // Real spatial calculation: map live GPS coordinates to route stops
    if (bus?.currentRoute?.routeStops && bus.currentRoute.routeStops.length > 0) {
      const stops = bus.currentRoute.routeStops;
      
      // Find the closest stop to current GPS location
      let minDistance = Infinity;
      let closestStopIdx = 0;

      for (let i = 0; i < stops.length; i++) {
        const d = this.calculateDistanceMeters(ping.lat, ping.lng, stops[i].stop.lat, stops[i].stop.lng);
        if (d < minDistance) {
          minDistance = d;
          closestStopIdx = i;
        }
      }

      // If very close to a stop (< 150m), that stop is current or approaching next
      let targetStopIdx = closestStopIdx;
      if (closestStopIdx < stops.length - 1 && minDistance < 200) {
        targetStopIdx = closestStopIdx + 1; // Moving towards next stop
      }

      const targetStop = stops[targetStopIdx].stop;
      nextStopId = targetStop.id;
      nextStopName = targetStop.name;
      distanceToNextStopMeters = this.calculateDistanceMeters(ping.lat, ping.lng, targetStop.lat, targetStop.lng);
      passedStopsCount = Math.max(1, targetStopIdx);

      // Real-world dynamic ETA: based on current speed (or realistic baseline if stopped at light)
      const effectiveSpeed = ping.speed > 5 ? ping.speed : 24.0; // km/h
      nextStopEtaMins = Math.max(1, Math.ceil((distanceToNextStopMeters / 1000) / (effectiveSpeed / 60)));
    }

    const stored: StoredTelemetry = {
      id: bus?.id || `live-${ping.busNumber}`,
      busId: bus?.id,
      busNumber: ping.busNumber,
      lat: ping.lat,
      lng: ping.lng,
      speed: Math.round(ping.speed * 10) / 10,
      heading: ping.heading || 0,
      accuracyMeters: ping.accuracyMeters || 5,
      occupancyStatus: ping.occupancyStatus || bus?.occupancyStatus as any || 'MEDIUM',
      driverName: ping.driverName || 'Duty Driver',
      source: ping.source || 'DRIVER_APP',
      timestamp: ping.timestamp || now,
      lastPingAgoSeconds: 0,
      gpsSignal: 'STRONG',
      nextStopId,
      nextStopName,
      distanceToNextStopMeters,
      nextStopEtaMins,
      passedStopsCount
    };

    this.pings.set(ping.busNumber, stored);

    // Persist real position to SQLite in the background (fire and forget)
    if (bus) {
      prisma.bus.update({
        where: { id: bus.id },
        data: {
          lat: ping.lat,
          lng: ping.lng,
          speed: stored.speed,
          occupancyStatus: stored.occupancyStatus,
          nextStopId: nextStopId || null
        }
      }).catch(err => console.error(`Error updating bus ${bus.busNumber} in DB:`, err));
    }

    return stored;
  }

  // Get live telemetry for a specific bus
  public getLiveTelemetryForBus(busNumber: string): StoredTelemetry | undefined {
    return this.pings.get(busNumber);
  }

  // Get all active live telemetry entries
  public getAllLiveTelemetries(): StoredTelemetry[] {
    return Array.from(this.pings.values());
  }

  // Get statistics on real-world telemetry stream
  public getStats() {
    const activeCount = Array.from(this.pings.values()).filter(p => p.gpsSignal === 'STRONG' || p.gpsSignal === 'FAIR').length;
    return {
      activeLiveDevices: activeCount,
      totalRegisteredBuses: this.pings.size,
      totalPingsIngested: this.totalPingsIngested,
      devices: Array.from(this.pings.values()).map(p => ({
        busNumber: p.busNumber,
        speed: p.speed,
        source: p.source,
        gpsSignal: p.gpsSignal,
        lastPingAgoSeconds: p.lastPingAgoSeconds,
        accuracyMeters: p.accuracyMeters
      }))
    };
  }
}

export const telemetryStore = new TelemetryStore();
