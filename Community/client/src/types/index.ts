export type UserRole = 'PASSENGER' | 'FIELD_SURVEYOR' | 'TRANSPORT_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Stop {
  id: string;
  code: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  shelter?: boolean;
  accessibility?: boolean;
}

export interface RouteStop {
  id: string;
  routeId: string;
  stopId: string;
  sequenceOrder: number;
  distanceToNextKm: number;
  estimatedTravelTimeMins: number;
  stop: Stop;
}

export interface Bus {
  id: string;
  busNumber: string;
  busType: 'ORDINARY' | 'METRO_EXPRESS' | 'METRO_DELUXE' | 'PALLE_VELUGU';
  capacity: number;
  status: 'ACTIVE' | 'MAINTENANCE';
  currentRouteId?: string | null;
  lat: number;
  lng: number;
  speed: number;
  occupancyStatus: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  delayMinutes: number;
  currentRoute?: Route;
  nextStopId?: string;
  nextStopName?: string;
  distanceToNextStopMeters?: number;
  nextStopEtaMins?: number;
  passedStopsCount?: number;
  currentSegmentIndex?: number;
  isLiveGps?: boolean;
  isRealWorldGps?: boolean;
  gpsSignal?: 'STRONG' | 'FAIR' | 'STALE' | 'OFFLINE' | 'ACTIVE_TRANSIT' | 'STANDBY';
  source?: 'DRIVER_APP' | 'AIS140_IOT' | 'GTFS_RT' | 'SCHEDULED_TRANSIT';
  accuracyMeters?: number;
  heading?: number;
  lastPingAgoSeconds?: number;
  driverName?: string;
  telemetryTimestamp?: string;
}

export interface TelemetryDeviceStat {
  busNumber: string;
  speed: number;
  source: string;
  gpsSignal: string;
  lastPingAgoSeconds: number;
  accuracyMeters: number;
}

export interface TelemetryStats {
  activeLiveDevices: number;
  totalRegisteredBuses: number;
  totalPingsIngested: number;
  devices: TelemetryDeviceStat[];
  externalFeed: {
    feedUrl: string;
    apiKey?: string;
    feedType: string;
    pollingIntervalSeconds: number;
    enabled: boolean;
    lastSyncAt?: string;
    lastSyncStatus?: string;
    lastVehiclesCount?: number;
    lastError?: string;
  };
}

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  totalStops: number;
  status: string;
  frequencyMins: number;
  busCount: number;
  peakDemandLevel: string;
  routeStops: RouteStop[];
  buses: Bus[];
}

export interface PassengerRecord {
  id?: string;
  boardingStopId: string;
  alightingStopId: string;
  passengerCount: number;
  category: 'GENERAL' | 'STUDENT' | 'SENIOR_CITIZEN' | 'WOMEN_CHILD';
  lat?: number;
  lng?: number;
  boardingStop?: Stop;
  alightingStop?: Stop;
}

export interface Survey {
  id?: string;
  surveyorId?: string;
  routeId: string;
  busId?: string;
  busType: string;
  direction: 'UP' | 'DOWN';
  surveyDate: string;
  surveyTime: string;
  records: PassengerRecord[];
  route?: Route;
  bus?: Bus;
  surveyor?: { name: string; email: string };
  createdAt?: string;
}

export interface RouteUtilisation {
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

export interface UnderServedArea {
  id: string;
  areaName: string;
  lat: number;
  lng: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  nearestStopId?: string;
  nearestStop?: Stop;
  distanceToStopKm: number;
  availableBusesCount: number;
  avgBusFrequencyMins: number;
  peakDemandPaxHr: number;
  availableCapacityPaxHr: number;
  unmetDemandPaxHr: number;
  classificationReason: string;
  priorityScore: number;
  isUnderservedByDistance?: boolean;
  isUnderservedByFrequency?: boolean;
  isUnderservedByCapacity?: boolean;
  passesFilter?: boolean;
}

export interface Recommendation {
  id: string;
  targetAreaOrRoute: string;
  title: string;
  recommendationType: 'INCREASE_FREQUENCY' | 'ADD_NEW_STOP' | 'EXTEND_ROUTE' | 'FEEDER_ROUTE' | 'MODIFY_ALIGNMENT' | 'PEAK_HOUR_BUSES' | 'REDUCE_LOW_DEMAND_SERVICE';
  details: string;
  reason: string;
  expectedImpact: string;
  confidencePercent: number;
  dataDaysCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  appliedAction?: string;
}

export interface Alert {
  id: string;
  routeId?: string;
  busId?: string;
  alertType: 'BUS_APPROACHING' | 'DELAYED' | 'ROUTE_CHANGED' | 'STOP_SKIPPED' | 'ALTERNATIVE_AVAILABLE';
  message: string;
  status: string;
  timestamp: string;
  route?: { routeNumber: string; name: string };
  bus?: { busNumber: string; busType: string };
}
