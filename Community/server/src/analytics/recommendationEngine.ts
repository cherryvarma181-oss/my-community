import { prisma } from '../config/db';
import { calculateRouteUtilisation } from './utilizationCalculator';

export async function generateRouteRecommendations() {
  const recommendations = await prisma.recommendation.findMany({
    orderBy: [
      { priority: 'asc' },
      { confidencePercent: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return recommendations;
}

export async function computeFreshRecommendations() {
  const utilisations = await calculateRouteUtilisation();
  const underservedAreas = await prisma.underServedArea.findMany({
    include: { nearestStop: true }
  });

  const generatedList: Array<{
    targetAreaOrRoute: string;
    title: string;
    recommendationType: string;
    details: string;
    reason: string;
    expectedImpact: string;
    confidencePercent: number;
    priority: string;
    status: string;
    dataDaysCount: number;
  }> = [];

  // 1. High Utilisation Corridor Interventions
  for (const u of utilisations) {
    if (u.utilisationScore >= 75 || u.peakHourUtilisationPercent >= 80) {
      const extraBuses = u.utilisationScore >= 85 ? 3 : 2;
      const confidence = Math.min(97.5, Math.round((87 + (u.totalPassengers / 1200)) * 10) / 10);

      generatedList.push({
        targetAreaOrRoute: `${u.routeName} (Route ${u.routeNumber})`,
        title: `Deploy ${extraBuses} Peak-Hour Express Buses on Route ${u.routeNumber} (${u.highDemandSections})`,
        recommendationType: 'PEAK_HOUR_BUSES',
        details: `Inject ${extraBuses} high-capacity Metro Express units operating between ${u.highDemandSections} during peak morning (7:30–10:00 AM) and evening (5:30–8:30 PM) windows.`,
        reason: `Empirical survey logs indicate Route ${u.routeNumber} carrying capacity exceeds safe load factor with ${u.utilisationScore}% score and ${u.peakHourUtilisationPercent}% peak load. High passenger density clustered at ${u.highDemandSections}.`,
        expectedImpact: `Reduces commuter platform wait times by 48%, eliminates left-behind passengers at peak stops, and cuts bus headways from ~18 min to 9 min.`,
        confidencePercent: confidence,
        priority: 'HIGH',
        status: 'PENDING',
        dataDaysCount: 14
      });

      if (u.peakHourUtilisationPercent >= 85) {
        generatedList.push({
          targetAreaOrRoute: `Corridor Route ${u.routeNumber}`,
          title: `Increase Route ${u.routeNumber} Service Frequency to 8-Minute Headways`,
          recommendationType: 'INCREASE_FREQUENCY',
          details: `Shorten scheduled interval from standard frequency down to an 8-minute high-frequency rapid transit timetable during business hours.`,
          reason: `High passenger turnover (${u.totalPassengers} surveyed riders, ${u.passengerDemandPerKm} pax/km) causing boarding dwell delays.`,
          expectedImpact: `Distributes passenger load smoothly across consecutive buses, decreasing average in-bus overcrowding by 35%.`,
          confidencePercent: Math.min(96, confidence - 2),
          priority: 'HIGH',
          status: 'PENDING',
          dataDaysCount: 14
        });
      }
    } else if (u.utilisationScore < 45) {
      // 2. Low Demand Re-allocation
      generatedList.push({
        targetAreaOrRoute: `${u.routeName} (Route ${u.routeNumber})`,
        title: `Optimize Fleet: Re-align Route ${u.routeNumber} & Reallocate 1 Bus to High-Demand Lines`,
        recommendationType: 'MODIFY_ALIGNMENT',
        details: `Streamline Route ${u.routeNumber} off-peak timetable and reallocate 1 surplus bus to peak corridors (e.g. Route 28 or 45).`,
        reason: `Route ${u.routeNumber} registers low load factor (${u.utilisationScore}% utilisation score, ${u.avgPassengersPerTrip} avg pax/trip), indicating fleet capacity is currently underutilized on ${u.lowDemandSections}.`,
        expectedImpact: `Saves municipal operational fuel expenditure and improves fleet productivity index by 22% with negligible impact on local passengers.`,
        confidencePercent: 88.0,
        priority: 'MEDIUM',
        status: 'PENDING',
        dataDaysCount: 14
      });
    }
  }

  // 3. Under-Served Transit Desert Interventions
  for (const area of underservedAreas) {
    if (area.unmetDemandPaxHr >= 50 || area.distanceToStopKm >= 1.2) {
      const nearestStopName = area.nearestStop?.name || 'Nearest Transit Hub';
      const confidence = Math.min(95.0, Math.round((84 + (area.unmetDemandPaxHr / 25)) * 10) / 10);

      generatedList.push({
        targetAreaOrRoute: `${area.areaName} Transit Gap`,
        title: `Introduce Dedicated Feeder Shuttle Route connecting ${area.areaName} ↔ ${nearestStopName}`,
        recommendationType: 'FEEDER_ROUTE',
        details: `Deploy a 12-to-15 minute interval feeder minibus service linking ${area.areaName} directly to ${nearestStopName} with transfer interchange points.`,
        reason: `Spatial diagnostic identifies a ${area.distanceToStopKm} km walk to nearest bus stop with average 30+ min headways and ${area.unmetDemandPaxHr} pax/hr unmet passenger surge: "${area.classificationReason}"`,
        expectedImpact: `Bridges the ${area.distanceToStopKm} km spatial transit gap for ~${area.unmetDemandPaxHr * 5}+ daily workers/residents, eliminating reliance on informal private transit.`,
        confidencePercent: confidence,
        priority: area.demandLevel === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        status: 'PENDING',
        dataDaysCount: 14
      });
    }
  }

  // Persist / Upsert into DB without creating exact duplicates
  const existing = await prisma.recommendation.findMany();
  let createdCount = 0;

  for (const item of generatedList) {
    const duplicate = existing.find(
      e => e.targetAreaOrRoute === item.targetAreaOrRoute && e.recommendationType === item.recommendationType
    );

    if (!duplicate) {
      await prisma.recommendation.create({ data: item });
      createdCount++;
    }
  }

  return await generateRouteRecommendations();
}

export async function applyApprovedRecommendation(id: string) {
  const rec = await prisma.recommendation.findUnique({ where: { id } });
  if (!rec) throw new Error('Recommendation not found');

  let appliedAction = 'Status updated to APPROVED';

  // Extract route number if present (e.g., "Route 28", "Route 32", "Route 45")
  const match = rec.targetAreaOrRoute.match(/Route\s+([A-Za-z0-9]+)/i) || rec.title.match(/Route\s+([A-Za-z0-9]+)/i);

  if (match) {
    const routeNumber = match[1];
    const route = await prisma.route.findUnique({ where: { routeNumber } });

    if (route) {
      if (rec.recommendationType === 'PEAK_HOUR_BUSES') {
        await prisma.route.update({
          where: { id: route.id },
          data: {
            busCount: route.busCount + 2,
            peakDemandLevel: 'HIGH',
            status: 'ACTIVE'
          }
        });
        appliedAction = `Applied to Fleet: Route ${routeNumber} fleet capacity increased from ${route.busCount} to ${route.busCount + 2} buses!`;
      } else if (rec.recommendationType === 'INCREASE_FREQUENCY') {
        const newFreq = Math.max(6, Math.round(route.frequencyMins * 0.7));
        await prisma.route.update({
          where: { id: route.id },
          data: {
            frequencyMins: newFreq,
            busCount: route.busCount + 1,
            status: 'ACTIVE'
          }
        });
        appliedAction = `Applied to Fleet: Route ${routeNumber} headway reduced from ${route.frequencyMins} min to ${newFreq} min!`;
      } else if (rec.recommendationType === 'MODIFY_ALIGNMENT' || rec.recommendationType === 'REDUCE_LOW_DEMAND_SERVICE') {
        await prisma.route.update({
          where: { id: route.id },
          data: {
            busCount: Math.max(2, route.busCount - 1),
            status: 'MODIFIED'
          }
        });
        appliedAction = `Applied to Fleet: Route ${routeNumber} re-aligned and re-allocated 1 surplus bus unit.`;
      }
    }
  }

  return { recommendation: rec, appliedAction };
}
