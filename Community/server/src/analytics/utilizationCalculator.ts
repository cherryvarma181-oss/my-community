import { prisma } from '../config/db';

export interface RouteUtilisationResult {
  routeId: string;
  routeNumber: string;
  routeName: string;
  totalPassengers: number;
  avgPassengersPerTrip: number;
  peakPassengers: number;
  avgOccupancyPercent: number;
  peakHourUtilisationPercent: number;
  lowDemandSections: string;
  highDemandSections: string;
  passengerDemandPerKm: number;
  utilisationScore: number;
  demandCategory: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function calculateRouteUtilisation(routeId?: string): Promise<RouteUtilisationResult[]> {
  const routes = await prisma.route.findMany({
    where: routeId ? { id: routeId } : undefined,
    include: {
      buses: true,
      routeStops: {
        include: { stop: true },
        orderBy: { sequenceOrder: 'asc' }
      },
      surveys: {
        include: { records: true }
      }
    }
  });

  const results: RouteUtilisationResult[] = [];

  for (const route of routes) {
    // Calculate total passengers from surveys
    let totalPassengers = 0;
    let totalSurveys = route.surveys.length;
    let peakPassengers = 0;

    // Stop-level aggregate demand map
    const stopDemandMap: Record<string, { boarding: number; alighting: number; name: string }> = {};
    
    route.routeStops.forEach(rs => {
      stopDemandMap[rs.stopId] = { boarding: 0, alighting: 0, name: rs.stop.name };
    });

    for (const survey of route.surveys) {
      let tripPax = 0;
      for (const rec of survey.records) {
        tripPax += rec.passengerCount;
        totalPassengers += rec.passengerCount;

        if (stopDemandMap[rec.boardingStopId]) {
          stopDemandMap[rec.boardingStopId].boarding += rec.passengerCount;
        }
        if (stopDemandMap[rec.alightingStopId]) {
          stopDemandMap[rec.alightingStopId].alighting += rec.passengerCount;
        }
      }
      if (tripPax > peakPassengers) {
        peakPassengers = tripPax;
      }
    }

    const tripsCount = Math.max(1, totalSurveys);
    const avgPassengersPerTrip = Math.round((totalPassengers / tripsCount) * 10) / 10;

    // Average bus capacity on this route
    const totalBusCapacity = route.buses.reduce((sum, b) => sum + b.capacity, 0) || (route.busCount * 55);
    const avgBusCapacity = route.buses.length > 0 ? totalBusCapacity / route.buses.length : 55;

    // Carrying capacity = Number of buses * trips per day (approx 6 trips/bus) * capacity
    const estimatedDailyTrips = Math.max(1, route.busCount * 6);
    const dailyCarryingCapacity = estimatedDailyTrips * avgBusCapacity;

    // Utilisation % = (Passenger Demand / Available Carrying Capacity) * 100
    // Normalized for demo scale if sample survey records represent daily sample
    const rawUtilisation = dailyCarryingCapacity > 0 ? (totalPassengers / dailyCarryingCapacity) * 100 : 50;
    const avgOccupancyPercent = Math.min(100, Math.round((avgPassengersPerTrip / avgBusCapacity) * 100 * 10) / 10);
    const peakHourUtilisationPercent = Math.min(100, Math.round((peakPassengers / avgBusCapacity) * 100 * 10) / 10);

    const passengerDemandPerKm = Math.round((totalPassengers / (route.distanceKm || 1)) * 10) / 10;

    // Identify high demand & low demand sections
    const sortedStops = Object.values(stopDemandMap).sort((a, b) => (b.boarding + b.alighting) - (a.boarding + a.alighting));
    const highDemandSections = sortedStops.slice(0, 2).map(s => s.name).join(' – ') || route.origin;
    const lowDemandSections = sortedStops.slice(-2).map(s => s.name).join(' – ') || route.destination;

    const utilisationScore = Math.min(100, Math.round((avgOccupancyPercent * 0.6 + peakHourUtilisationPercent * 0.4)));

    let demandCategory: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (utilisationScore >= 80) demandCategory = 'HIGH';
    else if (utilisationScore < 45) demandCategory = 'LOW';

    results.push({
      routeId: route.id,
      routeNumber: route.routeNumber,
      routeName: route.name,
      totalPassengers,
      avgPassengersPerTrip,
      peakPassengers,
      avgOccupancyPercent,
      peakHourUtilisationPercent,
      lowDemandSections,
      highDemandSections,
      passengerDemandPerKm,
      utilisationScore,
      demandCategory
    });
  }

  return results;
}
