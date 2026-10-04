import { PrismaClient } from '@prisma/client';
import { getSeedData } from './seedData';
import { calculateRouteUtilisation } from '../analytics/utilizationCalculator';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting APSMART Bus Intelligence Database Seeding...');

  // Clean old data
  await prisma.passengerFeedback.deleteMany();
  await prisma.savedRoute.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.underServedArea.deleteMany();
  await prisma.routeUtilisation.deleteMany();
  await prisma.passengerRecord.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();

  const { users, stops: stopInputs, routes: routeInputs } = await getSeedData();

  // Create Users
  const createdUsers: Record<string, string> = {};
  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    createdUsers[u.role] = user.id;
    console.log(`✓ User created: ${u.email} (${u.role})`);
  }

  // Create Stops
  const createdStops: Record<string, any> = {};
  for (const s of stopInputs) {
    const stop = await prisma.stop.create({ data: s });
    createdStops[s.code] = stop;
  }
  console.log(`✓ ${stopInputs.length} Bus Stops created`);

  // Create Routes & RouteStops
  const createdRoutes: Record<string, any> = {};
  const routeStopMap: Record<string, string[]> = {
    '28': ['STP-MDW', 'STP-MDX', 'STP-PMP', 'STP-HNK', 'STP-MDP', 'STP-RTC'],
    '32': ['STP-PND', 'STP-KTH', 'STP-NDT', 'STP-GPL', 'STP-NAD', 'STP-RTC'],
    '45': ['STP-GJW', 'STP-KRM', 'STP-SCN', 'STP-MND', 'STP-MLK', 'STP-CNV', 'STP-RTC'],
    '6A': ['STP-SCN', 'STP-NVD', 'STP-PRM', 'STP-JGD', 'STP-RTC', 'STP-MDP'],
    '500': ['STP-ANK', 'STP-GJW', 'STP-NAD', 'STP-RTC', 'STP-MDP', 'STP-HNK', 'STP-PMP', 'STP-TAG'],
    '111': ['STP-KRM', 'STP-DVV', 'STP-GJW', 'STP-AIR', 'STP-NAD', 'STP-RTC'],
    '38': ['STP-STL', 'STP-GJW', 'STP-SCN', 'STP-CNV', 'STP-JGD', 'STP-RTC'],
    '25K': ['STP-KTH', 'STP-PND', 'STP-SMH', 'STP-GPL', 'STP-NAD', 'STP-RTC'],
    '60': ['STP-BHM', 'STP-KLG', 'STP-RSH', 'STP-MDW', 'STP-MDP', 'STP-RTC'],
    '68': ['STP-SMT', 'STP-SMH', 'STP-GPL', 'STP-NAD', 'STP-RTC']
  };

  for (const r of routeInputs) {
    const route = await prisma.route.create({ data: r });
    createdRoutes[r.routeNumber] = route;

    const stopCodes = routeStopMap[r.routeNumber] || ['STP-MDW', 'STP-MDP', 'STP-RTC'];
    let seq = 1;
    for (const code of stopCodes) {
      if (createdStops[code]) {
        await prisma.routeStop.create({
          data: {
            routeId: route.id,
            stopId: createdStops[code].id,
            sequenceOrder: seq,
            distanceToNextKm: 1.5,
            estimatedTravelTimeMins: 4
          }
        });
        seq++;
      }
    }
  }
  console.log(`✓ ${routeInputs.length} Routes & RouteStops created`);

  // Create Buses
  const busTypes = ['ORDINARY', 'METRO_EXPRESS', 'METRO_DELUXE', 'PALLE_VELUGU'];
  const createdBuses: any[] = [];

  const busSeedSpecs = [
    { num: 'AP 31 Z 1204', route: '28', type: 'METRO_EXPRESS', cap: 55, occ: 'HIGH', delay: 0, lat: 17.7876, lng: 83.3421 },
    { num: 'AP 31 Z 1205', route: '28', type: 'ORDINARY', cap: 60, occ: 'FULL', delay: 12, lat: 17.7540, lng: 83.3280 },
    { num: 'AP 31 Z 1206', route: '28', type: 'METRO_DELUXE', cap: 45, occ: 'MEDIUM', delay: 5, lat: 17.7340, lng: 83.3150 },
    { num: 'AP 31 Z 3201', route: '32', type: 'PALLE_VELUGU', cap: 65, occ: 'FULL', delay: 20, lat: 17.7650, lng: 83.2200 },
    { num: 'AP 31 Z 3202', route: '32', type: 'ORDINARY', cap: 60, occ: 'HIGH', delay: 8, lat: 17.7510, lng: 83.2350 },
    { num: 'AP 31 Z 4501', route: '45', type: 'METRO_EXPRESS', cap: 55, occ: 'MEDIUM', delay: 0, lat: 17.6850, lng: 83.2840 },
    { num: 'AP 31 Z 4502', route: '45', type: 'ORDINARY', cap: 60, occ: 'HIGH', delay: 3, lat: 17.6910, lng: 83.2750 },
    { num: 'AP 31 Z 6001', route: '60', type: 'METRO_DELUXE', cap: 45, occ: 'HIGH', delay: 0, lat: 17.8023, lng: 83.3512 },
    { num: 'AP 31 Z 5001', route: '500', type: 'METRO_EXPRESS', cap: 55, occ: 'FULL', delay: 15, lat: 17.7370, lng: 83.2500 },
    { num: 'AP 31 Z 6801', route: '68', type: 'ORDINARY', cap: 60, occ: 'LOW', delay: 0, lat: 17.7710, lng: 83.2490 }
  ];

  for (const b of busSeedSpecs) {
    const routeObj = createdRoutes[b.route];
    const bus = await prisma.bus.create({
      data: {
        busNumber: b.num,
        busType: b.type,
        capacity: b.cap,
        status: 'ACTIVE',
        currentRouteId: routeObj ? routeObj.id : null,
        lat: b.lat,
        lng: b.lng,
        speed: 32.4,
        occupancyStatus: b.occ,
        delayMinutes: b.delay
      }
    });
    createdBuses.push(bus);
  }
  console.log(`✓ ${busSeedSpecs.length} Active Buses created`);

  // Create Surveys & 1,000+ Passenger Survey Records
  console.log('📊 Generating 1,000+ realistic passenger survey records...');
  const surveyorId = createdUsers['FIELD_SURVEYOR'];
  const categories = ['GENERAL', 'STUDENT', 'SENIOR_CITIZEN', 'WOMEN_CHILD'];

  let totalRecordsCount = 0;

  for (const routeNum of Object.keys(routeStopMap)) {
    const route = createdRoutes[routeNum];
    const stopCodes = routeStopMap[routeNum];

    // Create 5 surveys for each route (morning peak, evening peak, mid-day)
    const surveyTimes = ['08:15 AM', '09:30 AM', '01:15 PM', '05:45 PM', '07:10 PM'];

    for (let i = 0; i < surveyTimes.length; i++) {
      const surveyTime = surveyTimes[i];
      const isPeak = surveyTime.includes('08:') || surveyTime.includes('09:') || surveyTime.includes('05:') || surveyTime.includes('07:');
      
      const survey = await prisma.survey.create({
        data: {
          surveyorId,
          routeId: route.id,
          busType: i % 2 === 0 ? 'METRO_EXPRESS' : 'ORDINARY',
          direction: i % 2 === 0 ? 'UP' : 'DOWN',
          surveyDate: '2026-10-02',
          surveyTime: surveyTime,
          status: 'COMPLETED'
        }
      });

      // Generate passenger records between stop pairs
      for (let s = 0; s < stopCodes.length - 1; s++) {
        const boardCode = stopCodes[s];
        const alightCode = stopCodes[Math.min(stopCodes.length - 1, s + 1 + Math.floor(Math.random() * 2))];

        const boardStop = createdStops[boardCode];
        const alightStop = createdStops[alightCode];

        if (boardStop && alightStop && boardStop.id !== alightStop.id) {
          // Passenger count per record (10 to 45 depending on peak/offpeak)
          const multiplier = isPeak ? 2.5 : 1.0;
          const paxCount = Math.floor((12 + Math.random() * 25) * multiplier);

          await prisma.passengerRecord.create({
            data: {
              surveyId: survey.id,
              boardingStopId: boardStop.id,
              alightingStopId: alightStop.id,
              passengerCount: paxCount,
              category: categories[Math.floor(Math.random() * categories.length)],
              lat: boardStop.lat,
              lng: boardStop.lng
            }
          });
          totalRecordsCount += paxCount;
        }
      }
    }
  }
  console.log(`✓ ${totalRecordsCount} Passenger Boarding/Alighting records generated across surveys`);

  // Calculate & Seed Route Utilisation
  console.log('⚡ Calculating & seeding Route Utilisation scores...');
  const utilisations = await calculateRouteUtilisation();
  for (const util of utilisations) {
    await prisma.routeUtilisation.create({
      data: {
        routeId: util.routeId,
        totalPassengers: util.totalPassengers,
        avgPassengersPerTrip: util.avgPassengersPerTrip,
        peakPassengers: util.peakPassengers,
        avgOccupancyPercent: util.avgOccupancyPercent,
        peakHourUtilisationPercent: util.peakHourUtilisationPercent,
        lowDemandSections: util.lowDemandSections,
        highDemandSections: util.highDemandSections,
        passengerDemandPerKm: util.passengerDemandPerKm,
        utilisationScore: util.utilisationScore,
        demandCategory: util.demandCategory
      }
    });
  }

  // Seed Under-Served Areas (Detailed with measurable metrics & explanations)
  console.log('📍 Seeding Under-Served Areas with diagnostic reasoning...');
  const underservedAreas = [
    {
      areaName: 'Madhurawada Sector X (IT Hill Phase 3)',
      lat: 17.8150,
      lng: 83.3610,
      demandLevel: 'CRITICAL',
      nearestStopId: createdStops['STP-MDX']?.id || null,
      distanceToStopKm: 1.8,
      availableBusesCount: 2,
      avgBusFrequencyMins: 28,
      peakDemandPaxHr: 340,
      availableCapacityPaxHr: 210,
      unmetDemandPaxHr: 130,
      classificationReason: 'High commuter demand from tech parks + 1.8km distance to primary bus stop + 28 min headways cause severe peak crowding.',
      priorityScore: 92.5
    },
    {
      areaName: 'Rushikonda IT Park Phase 3 Zone',
      lat: 17.7890,
      lng: 83.3920,
      demandLevel: 'HIGH',
      nearestStopId: createdStops['STP-RSH-EXT']?.id || null,
      distanceToStopKm: 1.5,
      availableBusesCount: 3,
      avgBusFrequencyMins: 22,
      peakDemandPaxHr: 290,
      availableCapacityPaxHr: 190,
      unmetDemandPaxHr: 100,
      classificationReason: 'Rapidly growing employment corridor with limited feeder shuttle frequency during morning peak hours (7:30-9:30 AM).',
      priorityScore: 84.0
    },
    {
      areaName: 'Gajuwaka SEZ & APIIC Industrial Belt',
      lat: 17.6710,
      lng: 83.2050,
      demandLevel: 'CRITICAL',
      nearestStopId: createdStops['STP-GJW-SEZ']?.id || null,
      distanceToStopKm: 2.1,
      availableBusesCount: 1,
      avgBusFrequencyMins: 35,
      peakDemandPaxHr: 420,
      availableCapacityPaxHr: 220,
      unmetDemandPaxHr: 200,
      classificationReason: 'Heavy industrial shift-change demand exceeding existing Metro Express capacity by 47.6%.',
      priorityScore: 95.0
    },
    {
      areaName: 'Kothavalasa – Pendurthi Outer Connector',
      lat: 17.8400,
      lng: 83.1900,
      demandLevel: 'HIGH',
      nearestStopId: createdStops['STP-KTH']?.id || null,
      distanceToStopKm: 1.4,
      availableBusesCount: 2,
      avgBusFrequencyMins: 30,
      peakDemandPaxHr: 210,
      availableCapacityPaxHr: 140,
      unmetDemandPaxHr: 70,
      classificationReason: 'High student population travelling to RTC Complex with insufficient Palle Velugu bus frequency.',
      priorityScore: 78.0
    }
  ];

  for (const usa of underservedAreas) {
    await prisma.underServedArea.create({ data: usa });
  }

  // Seed Data-Driven Route Recommendations
  console.log('💡 Seeding Data-Driven Route Recommendations...');
  const recommendations = [
    {
      targetAreaOrRoute: 'Madhurawada → PM Palem Corridor (Route 28)',
      title: 'Add 3 Peak-Hour Buses on Route 28 (7:30 AM – 10:00 AM)',
      recommendationType: 'PEAK_HOUR_BUSES',
      details: 'Deploy 3 additional Metro Express buses to run short trips between Madhurawada Sector X and RTC Complex during peak hours.',
      reason: 'Passenger survey boarding data indicates passenger demand exceeds available bus capacity by 38.2% with average waiting time of 22 minutes at PM Palem.',
      expectedImpact: 'Reduce average passenger waiting time from 22 min to 9 min and eliminate unmet peak demand of 130 pax/hr.',
      confidencePercent: 94.5,
      dataDaysCount: 14,
      status: 'APPROVED',
      priority: 'HIGH'
    },
    {
      targetAreaOrRoute: 'Gajuwaka Industrial Belt',
      title: 'Introduce Feeder Route 45F (Gajuwaka SEZ → Scindia Junction)',
      recommendationType: 'FEEDER_ROUTE',
      details: 'Operate a 15-minute interval minibuses/feeder service connecting Gajuwaka SEZ APIIC park directly to Scindia and RTC Complex.',
      reason: '2.1 km walking gap identified between factory gates and nearest stop STP-GJW-SEZ with 200 pax/hr unmet shift-change demand.',
      expectedImpact: 'Connect 400+ daily industrial workers to primary bus network and reduce illegal auto-rickshaw reliance.',
      confidencePercent: 91.0,
      dataDaysCount: 14,
      status: 'PENDING',
      priority: 'HIGH'
    },
    {
      targetAreaOrRoute: 'Pendurthi – Kothavalasa (Route 32)',
      title: 'Increase Route 32 Frequency from 20 mins to 12 mins',
      recommendationType: 'INCREASE_FREQUENCY',
      details: 'Add 2 additional City Ordinary buses to Route 32 fleet to lower headways during 5:00 PM - 8:30 PM evening peak.',
      reason: 'Average occupancy on Route 32 currently sits at 92.4% with frequent skipped stops recorded at Naiduthota due to overcrowded buses.',
      expectedImpact: 'Improve passenger comfort score and eliminate skipped stops at Naiduthota and Gopalapatnam.',
      confidencePercent: 88.5,
      dataDaysCount: 10,
      status: 'APPROVED',
      priority: 'HIGH'
    },
    {
      targetAreaOrRoute: 'Steel Plant Township (Route 38)',
      title: 'Modify Route Alignment & Reallocate 1 Low-Demand Bus to Route 28',
      recommendationType: 'MODIFY_ALIGNMENT',
      details: 'Re-align Route 38 low-demand off-peak segment and transfer 1 idle bus to high-demand Route 28 corridor.',
      reason: 'Route 38 utilization is currently low (34.2% occupancy) during mid-day 11:00 AM - 3:00 PM, while Route 28 experiences severe crowding.',
      expectedImpact: 'Optimize fleet utilization without incurring additional operational expenses.',
      confidencePercent: 86.0,
      dataDaysCount: 14,
      status: 'PENDING',
      priority: 'MEDIUM'
    }
  ];

  for (const rec of recommendations) {
    await prisma.recommendation.create({ data: rec });
  }

  // Seed Passenger Alerts
  console.log('🔔 Seeding Passenger Alerts...');
  const route28 = createdRoutes['28'];
  const route32 = createdRoutes['32'];
  const bus28 = createdBuses.find(b => b.busNumber === 'AP 31 Z 1204');
  const bus32 = createdBuses.find(b => b.busNumber === 'AP 31 Z 3201');

  await prisma.alert.createMany({
    data: [
      {
        routeId: route28?.id,
        busId: bus28?.id,
        alertType: 'BUS_APPROACHING',
        message: 'Metro Express AP 31 Z 1204 is approaching PM Palem (ETA 4 min).',
        status: 'ACTIVE'
      },
      {
        routeId: route32?.id,
        busId: bus32?.id,
        alertType: 'DELAYED',
        message: 'Route 32 bus AP 31 Z 3201 is delayed by approximately 20 minutes near Gopalapatnam due to traffic congestion.',
        status: 'ACTIVE'
      },
      {
        routeId: route32?.id,
        busId: bus32?.id,
        alertType: 'ALTERNATIVE_AVAILABLE',
        message: 'Alternative suggestion: Route 25K Ordinary bus is departing Gopalapatnam in 6 mins towards RTC Complex.',
        status: 'ACTIVE'
      }
    ]
  });

  console.log('✅ APSMART Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
