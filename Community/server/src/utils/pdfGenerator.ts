import { prisma } from '../config/db';
import { calculateRouteUtilisation } from '../analytics/utilizationCalculator';

export async function buildExecutiveReportData() {
  const routesCount = await prisma.route.count();
  const busesCount = await prisma.bus.count();
  const activeBusesCount = await prisma.bus.count({ where: { status: 'ACTIVE' } });
  const stopsCount = await prisma.stop.count();
  const totalSurveys = await prisma.survey.count();
  const records = await prisma.passengerRecord.aggregate({
    _sum: { passengerCount: true }
  });
  const totalPassengers = records._sum.passengerCount || 0;

  const utilisations = await calculateRouteUtilisation();
  const underserved = await prisma.underServedArea.findMany({ include: { nearestStop: true } });
  const recommendations = await prisma.recommendation.findMany();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRoutes: routesCount,
      totalBuses: busesCount,
      activeBuses: activeBusesCount,
      totalStops: stopsCount,
      totalSurveys,
      totalPassengers,
      underservedAreasCount: underserved.length,
      recommendationsCount: recommendations.length
    },
    routeUtilisations: utilisations,
    underservedAreas: underserved,
    recommendations
  };
}
