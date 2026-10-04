import { Router } from 'express';
import { prisma } from '../config/db';
import { telemetryStore, TelemetryPing } from '../services/telemetryService';

const router = Router();

// Helper to compute realistic dynamic GPS telemetry for a bus along its route (used as fallback when no real device is transmitting)
function computeDynamicTelemetry(bus: any) {
  const routeStops = bus.currentRoute?.routeStops;
  if (!routeStops || routeStops.length < 2) {
    return {
      ...bus,
      lat: bus.lat,
      lng: bus.lng,
      currentSpeed: bus.speed,
      nextStopName: 'RTC Complex',
      distanceToNextStopMeters: 500,
      nextStopEtaMins: 3,
      passedStopsCount: 2,
      isRealWorldGps: false,
      gpsSignal: 'STANDBY',
      source: 'SCHEDULED_TRANSIT'
    };
  }

  const now = Date.now() / 1000;
  const busSeed = bus.busNumber.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) * 23;
  const cycleSeconds = (routeStops.length - 1) * 75; // 75 seconds per segment for smooth visual progress
  const progressInCycle = ((now + busSeed) % cycleSeconds) / cycleSeconds;

  const totalSegments = routeStops.length - 1;
  const segmentFloat = progressInCycle * totalSegments;
  const currentSegmentIndex = Math.min(totalSegments - 1, Math.floor(segmentFloat));
  const segmentProgress = segmentFloat - currentSegmentIndex;

  const fromStop = routeStops[currentSegmentIndex].stop;
  const toStop = routeStops[currentSegmentIndex + 1].stop;

  // Linear interpolation along route segment
  const lat = fromStop.lat + (toStop.lat - fromStop.lat) * segmentProgress;
  const lng = fromStop.lng + (toStop.lng - fromStop.lng) * segmentProgress;

  const speed = Math.round((30 + 8 * Math.sin(now / 4 + busSeed)) * 10) / 10;
  const segmentDistKm = routeStops[currentSegmentIndex].distanceToNextKm || 1.5;
  const distanceToNextStopMeters = Math.max(40, Math.round(segmentDistKm * (1 - segmentProgress) * 1000));
  const nextStopEtaMins = Math.max(1, Math.ceil((distanceToNextStopMeters / 1000) / (speed / 60)));

  return {
    ...bus,
    lat,
    lng,
    speed,
    currentSpeed: speed,
    nextStopId: toStop.id,
    nextStopName: toStop.name,
    distanceToNextStopMeters,
    nextStopEtaMins,
    passedStopsCount: currentSegmentIndex + 1,
    currentSegmentIndex,
    isRealWorldGps: false,
    isLiveGps: true,
    gpsSignal: 'ACTIVE_TRANSIT',
    source: 'SCHEDULED_TRANSIT',
    telemetryTimestamp: new Date().toISOString()
  };
}

// Master resolver: Prioritizes real-world incoming GPS pings (from Driver Phone, AIS-140 Tracker, or GTFS-RT feed)
function resolveBusTelemetry(bus: any) {
  const realLivePing = telemetryStore.getLiveTelemetryForBus(bus.busNumber);

  if (realLivePing && realLivePing.gpsSignal !== 'OFFLINE') {
    return {
      ...bus,
      lat: realLivePing.lat,
      lng: realLivePing.lng,
      speed: realLivePing.speed,
      currentSpeed: realLivePing.speed,
      heading: realLivePing.heading || 0,
      accuracyMeters: realLivePing.accuracyMeters || 5,
      occupancyStatus: realLivePing.occupancyStatus || bus.occupancyStatus,
      nextStopId: realLivePing.nextStopId || bus.nextStopId,
      nextStopName: realLivePing.nextStopName || 'En Route',
      distanceToNextStopMeters: realLivePing.distanceToNextStopMeters,
      nextStopEtaMins: realLivePing.nextStopEtaMins,
      passedStopsCount: realLivePing.passedStopsCount || 1,
      driverName: realLivePing.driverName || 'Duty Driver',
      source: realLivePing.source || 'DRIVER_APP',
      isRealWorldGps: true,
      isLiveGps: true,
      gpsSignal: realLivePing.gpsSignal,
      lastPingAgoSeconds: realLivePing.lastPingAgoSeconds,
      telemetryTimestamp: new Date(realLivePing.timestamp).toISOString()
    };
  }

  return computeDynamicTelemetry(bus);
}

// GET all active buses with route info & live telemetry
router.get('/', async (req, res) => {
  try {
    const { type, routeId } = req.query;

    const whereClause: any = {};
    if (type && type !== 'ALL') {
      whereClause.busType = String(type);
    }
    if (routeId) {
      whereClause.currentRouteId = String(routeId);
    }

    const buses = await prisma.bus.findMany({
      where: whereClause,
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

    const busesWithTelemetry = buses.map(resolveBusTelemetry);

    return res.json(busesWithTelemetry);
  } catch (error) {
    console.error('Error fetching buses:', error);
    return res.status(500).json({ message: 'Error fetching buses' });
  }
});

// GET dedicated live telemetry stream for all buses
router.get('/live/telemetry', async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
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

    const telemetry = buses.map(resolveBusTelemetry);
    return res.json(telemetry);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching telemetry' });
  }
});

// POST /api/buses/live/ingest - Direct ingestion endpoint for Driver App and IoT Trackers
router.post('/live/ingest', async (req, res) => {
  try {
    const { busNumber, lat, lng, speed, heading, accuracyMeters, occupancyStatus, driverName, source } = req.body;
    if (!busNumber || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'busNumber, lat, and lng are required' });
    }

    const stored = await telemetryStore.ingestPing({
      busNumber: String(busNumber).trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      speed: parseFloat(speed) || 0,
      heading: parseFloat(heading) || 0,
      accuracyMeters: parseFloat(accuracyMeters) || 5,
      occupancyStatus: occupancyStatus || 'MEDIUM',
      driverName: driverName || 'Duty Operator',
      source: source || 'DRIVER_APP'
    });

    return res.json({ success: true, telemetry: stored });
  } catch (err: any) {
    console.error('Error ingesting live bus telemetry:', err);
    return res.status(500).json({ message: 'Error ingesting live bus telemetry' });
  }
});

// GET single bus details with live telemetry
router.get('/:id', async (req, res) => {
  try {
    const bus = await prisma.bus.findUnique({
      where: { id: req.params.id },
      include: {
        currentRoute: {
          include: {
            routeStops: {
              include: { stop: true },
              orderBy: { sequenceOrder: 'asc' }
            }
          }
        },
        alerts: true
      }
    });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const busWithTelemetry = resolveBusTelemetry(bus);

    return res.json(busWithTelemetry);
  } catch (error) {
    console.error('Error fetching bus:', error);
    return res.status(500).json({ message: 'Error fetching bus details' });
  }
});

// GET simulated / live GPS location for a specific bus
router.get('/:id/location', async (req, res) => {
  try {
    const bus = await prisma.bus.findUnique({
      where: { id: req.params.id },
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

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const telemetry = resolveBusTelemetry(bus);

    return res.json({
      id: telemetry.id,
      busNumber: telemetry.busNumber,
      lat: telemetry.lat,
      lng: telemetry.lng,
      speed: telemetry.speed,
      delayMinutes: telemetry.delayMinutes,
      occupancyStatus: telemetry.occupancyStatus,
      nextStopName: telemetry.nextStopName,
      distanceToNextStopMeters: telemetry.distanceToNextStopMeters,
      nextStopEtaMins: telemetry.nextStopEtaMins,
      passedStopsCount: telemetry.passedStopsCount,
      isRealWorldGps: telemetry.isRealWorldGps,
      gpsSignal: telemetry.gpsSignal,
      source: telemetry.source,
      accuracyMeters: telemetry.accuracyMeters,
      lastPingAgoSeconds: telemetry.lastPingAgoSeconds,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching bus location' });
  }
});

export default router;
