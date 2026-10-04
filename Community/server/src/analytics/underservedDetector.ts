import { prisma } from '../config/db';

export interface UnderservedDetectionOptions {
  distanceThresholdKm?: number; // Distance to stop (e.g. > 1.2 km)
  frequencyThresholdMins?: number; // Bus frequency (e.g. > 20 mins)
  peakUnmetThresholdPaxHr?: number; // Unmet demand (e.g. > 50 pax/hr)
}

export async function detectUnderServedAreas(options: UnderservedDetectionOptions = {}) {
  const distanceThreshold = options.distanceThresholdKm !== undefined ? options.distanceThresholdKm : 1.2;
  const frequencyThreshold = options.frequencyThresholdMins !== undefined ? options.frequencyThresholdMins : 20;
  const unmetThreshold = options.peakUnmetThresholdPaxHr !== undefined ? options.peakUnmetThresholdPaxHr : 50;

  const areas = await prisma.underServedArea.findMany({
    include: {
      nearestStop: true
    },
    orderBy: { priorityScore: 'desc' }
  });

  return areas.map(area => {
    // Dynamic criteria evaluation
    const isUnderservedByDistance = area.distanceToStopKm >= distanceThreshold;
    const isUnderservedByFrequency = area.avgBusFrequencyMins >= frequencyThreshold;
    const isUnderservedByCapacity = area.unmetDemandPaxHr >= unmetThreshold;

    // Dynamic Deficit Priority Score calculation
    const distanceFactor = Math.min(1, area.distanceToStopKm / 3.0) * 35;
    const capacityFactor = Math.min(1, area.unmetDemandPaxHr / 250) * 45;
    const frequencyFactor = Math.min(1, area.avgBusFrequencyMins / 40) * 20;
    const dynamicPriorityScore = Math.round((distanceFactor + capacityFactor + frequencyFactor) * 10) / 10;

    let dynamicDemandLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'MEDIUM';
    if (dynamicPriorityScore >= 85 || area.unmetDemandPaxHr >= 150) {
      dynamicDemandLevel = 'CRITICAL';
    } else if (dynamicPriorityScore >= 70 || area.unmetDemandPaxHr >= 80) {
      dynamicDemandLevel = 'HIGH';
    }

    const passesFilter = isUnderservedByDistance || isUnderservedByFrequency || isUnderservedByCapacity;

    return {
      ...area,
      demandLevel: dynamicDemandLevel,
      priorityScore: dynamicPriorityScore,
      isUnderservedByDistance,
      isUnderservedByFrequency,
      isUnderservedByCapacity,
      passesFilter,
      formula: `Unmet Demand = max(0, Peak Demand (${area.peakDemandPaxHr} pax/h) - Capacity (${area.availableCapacityPaxHr} pax/h)) = ${area.unmetDemandPaxHr} pax/h`
    };
  });
}

export async function createTransitGapReport(data: {
  areaName: string;
  lat: number;
  lng: number;
  distanceToStopKm: number;
  avgBusFrequencyMins: number;
  peakDemandPaxHr: number;
  classificationReason: string;
  nearestStopId?: string;
}) {
  const availableCapacity = Math.max(50, Math.round(data.peakDemandPaxHr * 0.4));
  const unmetDemand = Math.max(0, data.peakDemandPaxHr - availableCapacity);

  const priorityScore = Math.min(100, Math.round(
    ((unmetDemand / 250) * 45 + (data.distanceToStopKm / 3.0) * 35 + (data.avgBusFrequencyMins / 40) * 20) * 10
  ) / 10);

  const demandLevel = priorityScore >= 85 ? 'CRITICAL' : priorityScore >= 70 ? 'HIGH' : 'MEDIUM';

  const newArea = await prisma.underServedArea.create({
    data: {
      areaName: data.areaName,
      lat: data.lat,
      lng: data.lng,
      demandLevel,
      nearestStopId: data.nearestStopId || null,
      distanceToStopKm: Number(data.distanceToStopKm),
      availableBusesCount: 1,
      avgBusFrequencyMins: Number(data.avgBusFrequencyMins),
      peakDemandPaxHr: Number(data.peakDemandPaxHr),
      availableCapacityPaxHr: availableCapacity,
      unmetDemandPaxHr: unmetDemand,
      classificationReason: data.classificationReason || 'Crowdsourced transit desert report submitted by commuter.',
      priorityScore
    },
    include: {
      nearestStop: true
    }
  });

  return newArea;
}
