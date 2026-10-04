import bcrypt from 'bcryptjs';

export async function getSeedData() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@apsmart.com',
      password: hashedPassword,
      name: 'APSRTC Transport Admin',
      role: 'TRANSPORT_ADMIN'
    },
    {
      email: 'surveyor@apsmart.com',
      password: hashedPassword,
      name: 'Ramu Field Surveyor',
      role: 'FIELD_SURVEYOR'
    },
    {
      email: 'passenger@apsmart.com',
      password: hashedPassword,
      name: 'Srinivas Passenger',
      role: 'PASSENGER'
    }
  ];

  const stops = [
    { code: 'STP-MDW', name: 'Madhurawada', area: 'Madhurawada Sector 1', lat: 17.8023, lng: 83.3512 },
    { code: 'STP-MDX', name: 'Madhurawada Sector X', area: 'Madhurawada IT Hill', lat: 17.8150, lng: 83.3610 },
    { code: 'STP-PMP', name: 'PM Palem', area: 'PM Palem Stadium', lat: 17.7876, lng: 83.3421 },
    { code: 'STP-HNK', name: 'Hanumanthawaka', area: 'Hanumanthawaka Junction', lat: 17.7540, lng: 83.3280 },
    { code: 'STP-MDP', name: 'Maddilapalem', area: 'AU Campus North', lat: 17.7340, lng: 83.3150 },
    { code: 'STP-RTC', name: 'RTC Complex', area: 'Dwaraka Bus Station', lat: 17.7220, lng: 83.3010 },
    { code: 'STP-GPL', name: 'Gopalapatnam', area: 'Gopalapatnam Market', lat: 17.7510, lng: 83.2350 },
    { code: 'STP-PND', name: 'Pendurthi', area: 'Pendurthi Junction', lat: 17.7810, lng: 83.2080 },
    { code: 'STP-KTH', name: 'Kothavalasa', area: 'Kothavalasa Station', lat: 17.8920, lng: 83.1750 },
    { code: 'STP-NDT', name: 'Naiduthota', area: 'Naiduthota Center', lat: 17.7650, lng: 83.2200 },
    { code: 'STP-NAD', name: 'NAD Junction', area: 'NAD Flyover', lat: 17.7370, lng: 83.2500 },
    { code: 'STP-GJW', name: 'Gajuwaka', area: 'Gajuwaka Bus Depot', lat: 17.6910, lng: 83.2130 },
    { code: 'STP-KRM', name: 'Kurmannapalem', area: 'Steel Plant Main Gate', lat: 17.6740, lng: 83.1890 },
    { code: 'STP-SCN', name: 'Scindia', area: 'Shipyard Gate', lat: 17.6850, lng: 83.2840 },
    { code: 'STP-MND', name: 'Mindi', area: 'Mindi Industrial Zone', lat: 17.6890, lng: 83.2620 },
    { code: 'STP-MLK', name: 'Malkapuram', area: 'Malkapuram Center', lat: 17.6910, lng: 83.2750 },
    { code: 'STP-CNV', name: 'Convent Junction', area: 'Port Road', lat: 17.7050, lng: 83.2920 },
    { code: 'STP-NVD', name: 'Naval Dockyard', area: 'Dockyard Gate 2', lat: 17.6980, lng: 83.2970 },
    { code: 'STP-PRM', name: 'Poorna Market', area: 'Old City Center', lat: 17.7020, lng: 83.3000 },
    { code: 'STP-JGD', name: 'Jagadamba', area: 'Jagadamba Junction', lat: 17.7120, lng: 83.3020 },
    { code: 'STP-ANK', name: 'Anakapalle', area: 'Anakapalle RTC Bus Stand', lat: 17.6900, lng: 83.0040 },
    { code: 'STP-TAG', name: 'Tagarapuvalasa', area: 'Tagarapuvalasa Bridge', lat: 17.9250, lng: 83.4210 },
    { code: 'STP-DVV', name: 'Duvvada Railway Station', area: 'Duvvada Station Gate', lat: 17.6990, lng: 83.1600 },
    { code: 'STP-AIR', name: 'Visakhapatnam Airport', area: 'Airport Terminal', lat: 17.7210, lng: 83.2240 },
    { code: 'STP-STL', name: 'Steel Plant Township', area: 'Sector 6 Township', lat: 17.6530, lng: 83.1550 },
    { code: 'STP-SMH', name: 'Simhachalam', area: 'Simhachalam Bus Stand', lat: 17.7680, lng: 83.2420 },
    { code: 'STP-SMT', name: 'Simhachalam Temple', area: 'Hill Top Temple', lat: 17.7710, lng: 83.2490 },
    { code: 'STP-BHM', name: 'Bheemili', area: 'Bheemunipatnam Beach', lat: 17.8890, lng: 83.4520 },
    { code: 'STP-KLG', name: 'INS Kalinga', area: 'Naval Base Gate', lat: 17.8520, lng: 83.4110 },
    { code: 'STP-RSH', name: 'Rushikonda', area: 'IT Hill 2 Beach Road', lat: 17.7810, lng: 83.3850 },
    { code: 'STP-RSH-EXT', name: 'Rushikonda IT Park Phase 3', area: 'Hill 3 Special Zone', lat: 17.7890, lng: 83.3920 },
    { code: 'STP-GJW-SEZ', name: 'Gajuwaka SEZ Extension', area: 'APIIC Industrial Park', lat: 17.6710, lng: 83.2050 }
  ];

  const routes = [
    {
      routeNumber: '28',
      name: 'Madhurawada – RTC Complex',
      origin: 'Madhurawada',
      destination: 'RTC Complex',
      distanceKm: 16.5,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 12,
      busCount: 6,
      peakDemandLevel: 'HIGH'
    },
    {
      routeNumber: '32',
      name: 'Pendurthi – RTC Complex via Gopalapatnam',
      origin: 'Pendurthi',
      destination: 'RTC Complex',
      distanceKm: 19.2,
      totalStops: 6,
      status: 'DELAYED',
      frequencyMins: 20,
      busCount: 4,
      peakDemandLevel: 'HIGH'
    },
    {
      routeNumber: '45',
      name: 'Gajuwaka – RTC Complex via Scindia',
      origin: 'Gajuwaka',
      destination: 'RTC Complex',
      distanceKm: 21.0,
      totalStops: 7,
      status: 'ACTIVE',
      frequencyMins: 10,
      busCount: 8,
      peakDemandLevel: 'HIGH'
    },
    {
      routeNumber: '6A',
      name: 'Scindia – Maddilapalem via RTC Complex',
      origin: 'Scindia',
      destination: 'Maddilapalem',
      distanceKm: 14.8,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 15,
      busCount: 5,
      peakDemandLevel: 'MEDIUM'
    },
    {
      routeNumber: '500',
      name: 'Anakapalle – Tagarapuvalasa Express Corridor',
      origin: 'Anakapalle',
      destination: 'Tagarapuvalasa',
      distanceKm: 58.0,
      totalStops: 8,
      status: 'ACTIVE',
      frequencyMins: 25,
      busCount: 6,
      peakDemandLevel: 'HIGH'
    },
    {
      routeNumber: '111',
      name: 'Kurmannapalem – RTC Complex via Airport',
      origin: 'Kurmannapalem',
      destination: 'RTC Complex',
      distanceKm: 22.4,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 18,
      busCount: 4,
      peakDemandLevel: 'MEDIUM'
    },
    {
      routeNumber: '38',
      name: 'Steel Plant – RTC Complex via Port Road',
      origin: 'Steel Plant Township',
      destination: 'RTC Complex',
      distanceKm: 26.0,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 30,
      busCount: 3,
      peakDemandLevel: 'LOW'
    },
    {
      routeNumber: '25K',
      name: 'Kothavalasa – RTC Complex via Simhachalam',
      origin: 'Kothavalasa',
      destination: 'RTC Complex',
      distanceKm: 32.5,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 35,
      busCount: 3,
      peakDemandLevel: 'MEDIUM'
    },
    {
      routeNumber: '60',
      name: 'Bheemili – RTC Complex via Beach Road & Madhurawada',
      origin: 'Bheemili',
      destination: 'RTC Complex',
      distanceKm: 34.0,
      totalStops: 6,
      status: 'ACTIVE',
      frequencyMins: 20,
      busCount: 5,
      peakDemandLevel: 'HIGH'
    },
    {
      routeNumber: '68',
      name: 'Simhachalam Temple – RTC Complex',
      origin: 'Simhachalam Temple',
      destination: 'RTC Complex',
      distanceKm: 18.0,
      totalStops: 5,
      status: 'ACTIVE',
      frequencyMins: 15,
      busCount: 4,
      peakDemandLevel: 'HIGH'
    }
  ];

  return { users, stops, routes };
}
