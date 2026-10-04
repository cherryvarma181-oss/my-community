import { Router } from 'express';
import { telemetryStore, TelemetryPing } from '../services/telemetryService';
import { externalTransitConnector } from '../services/externalTransitConnector';

const router = Router();

// POST /api/telemetry/ingest - Ingest live real-world GPS ping from Driver App or IoT Device
router.post('/ingest', async (req, res) => {
  try {
    const {
      busId,
      busNumber,
      lat,
      lng,
      speed,
      heading,
      accuracyMeters,
      occupancyStatus,
      driverName,
      source
    } = req.body;

    if (!busNumber || lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: 'Invalid telemetry ping: busNumber, lat, and lng are required.'
      });
    }

    const ping: TelemetryPing = {
      busId,
      busNumber: String(busNumber).trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      speed: parseFloat(speed) || 0,
      heading: parseFloat(heading) || 0,
      accuracyMeters: parseFloat(accuracyMeters) || 5,
      occupancyStatus: occupancyStatus || 'MEDIUM',
      driverName: driverName || 'On-Duty Operator',
      source: source || 'DRIVER_APP',
      timestamp: Date.now()
    };

    const stored = await telemetryStore.ingestPing(ping);

    return res.status(200).json({
      success: true,
      message: 'Telemetry ping processed and snapped to transit route',
      telemetry: stored
    });
  } catch (error) {
    console.error('Error ingesting telemetry ping:', error);
    return res.status(500).json({ message: 'Error ingesting telemetry' });
  }
});

// GET /api/telemetry/stats - Live telemetry statistics and active devices
router.get('/stats', (req, res) => {
  try {
    const stats = telemetryStore.getStats();
    const externalConfig = externalTransitConnector.getConfig();
    return res.json({
      ...stats,
      externalFeed: externalConfig
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching telemetry stats' });
  }
});

// GET /api/telemetry/external/config - View current external transit API configuration
router.get('/external/config', (req, res) => {
  return res.json(externalTransitConnector.getConfig());
});

// POST /api/telemetry/external/config - Update external transit API feed URL and API key
router.post('/external/config', (req, res) => {
  try {
    const updated = externalTransitConnector.updateConfig(req.body);
    return res.json({
      message: 'External Transit API configuration updated',
      config: updated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating external transit config' });
  }
});

// POST /api/telemetry/external/sync - Trigger on-demand sync from external transit feed
router.post('/external/sync', async (req, res) => {
  try {
    const result = await externalTransitConnector.pollExternalFeed();
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
