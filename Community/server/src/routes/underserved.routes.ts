import { Router } from 'express';
import { detectUnderServedAreas, createTransitGapReport } from '../analytics/underservedDetector';
import { prisma } from '../config/db';

const router = Router();

// GET all under-served areas
router.get('/', async (req, res) => {
  try {
    const areas = await detectUnderServedAreas();
    return res.json(areas);
  } catch (error) {
    console.error('Error fetching under-served areas:', error);
    return res.status(500).json({ message: 'Error fetching under-served areas' });
  }
});

// Dynamic recalculation with custom threshold parameters
router.post('/recalculate', async (req, res) => {
  try {
    const { distanceThresholdKm, frequencyThresholdMins, peakUnmetThresholdPaxHr } = req.body;
    const areas = await detectUnderServedAreas({
      distanceThresholdKm: distanceThresholdKm !== undefined ? Number(distanceThresholdKm) : 1.2,
      frequencyThresholdMins: frequencyThresholdMins !== undefined ? Number(frequencyThresholdMins) : 20,
      peakUnmetThresholdPaxHr: peakUnmetThresholdPaxHr !== undefined ? Number(peakUnmetThresholdPaxHr) : 50
    });
    return res.json(areas);
  } catch (error) {
    return res.status(500).json({ message: 'Error recalculating under-served areas' });
  }
});

// Submit a new transit gap / underserved area report (passenger or surveyor)
router.post('/report', async (req, res) => {
  try {
    const { areaName, lat, lng, distanceToStopKm, avgBusFrequencyMins, peakDemandPaxHr, classificationReason, nearestStopId } = req.body;

    if (!areaName) {
      return res.status(400).json({ message: 'Area name is required' });
    }

    const newArea = await createTransitGapReport({
      areaName,
      lat: Number(lat) || 17.75,
      lng: Number(lng) || 83.30,
      distanceToStopKm: Number(distanceToStopKm) || 1.6,
      avgBusFrequencyMins: Number(avgBusFrequencyMins) || 25,
      peakDemandPaxHr: Number(peakDemandPaxHr) || 180,
      classificationReason: classificationReason || 'Commuter report: insufficient bus connectivity during peak hours.',
      nearestStopId
    });

    return res.status(201).json({
      message: 'Transit desert report logged successfully',
      area: newArea
    });
  } catch (error) {
    console.error('Error logging transit gap report:', error);
    return res.status(500).json({ message: 'Failed to create transit gap report' });
  }
});

// Generate a feeder route recommendation directly from an under-served area
router.post('/:id/generate-feeder', async (req, res) => {
  try {
    const area = await prisma.underServedArea.findUnique({
      where: { id: req.params.id },
      include: { nearestStop: true }
    });

    if (!area) {
      return res.status(404).json({ message: 'Under-served area not found' });
    }

    const nearestStopName = area.nearestStop?.name || 'Central RTC Complex';
    const feederTitle = `Introduce Feeder Route ${area.areaName.split(' ')[0]}-F (${area.areaName} ↔ ${nearestStopName})`;

    // Check if recommendation already exists
    const existing = await prisma.recommendation.findFirst({
      where: { targetAreaOrRoute: `${area.areaName} Transit Gap` }
    });

    if (existing) {
      return res.json({ message: 'Recommendation already active', recommendation: existing });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        targetAreaOrRoute: `${area.areaName} Transit Gap`,
        title: feederTitle,
        recommendationType: 'FEEDER_ROUTE',
        details: `Operate a 12-minute interval minibus feeder shuttle connecting ${area.areaName} directly to ${nearestStopName} with free transfer synchronization.`,
        reason: `Spatial diagnostic identifies a ${area.distanceToStopKm} km walk to nearest stop with average ${area.avgBusFrequencyMins} min headways and ${area.unmetDemandPaxHr} pax/hr unmet commuter demand.`,
        expectedImpact: `Directly bridges the ${area.distanceToStopKm} km transit desert for ${area.unmetDemandPaxHr * 4}+ daily commuters and reduces illegal auto-rickshaw fare gouging.`,
        confidencePercent: Math.min(96, Math.round(86 + area.priorityScore / 10)),
        status: 'PENDING',
        priority: area.demandLevel === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        dataDaysCount: 14
      }
    });

    return res.status(201).json({
      message: 'Feeder route recommendation generated and added to Admin Queue!',
      recommendation
    });
  } catch (error) {
    console.error('Error creating feeder recommendation:', error);
    return res.status(500).json({ message: 'Failed to generate feeder recommendation' });
  }
});

export default router;
