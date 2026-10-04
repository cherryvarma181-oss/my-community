import axios from 'axios';
import { Route, Bus, Stop, Survey, RouteUtilisation, UnderServedArea, Recommendation, Alert, User } from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set JWT token header
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('apsmart_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('apsmart_token');
  }
};

// Initialize token on boot
const savedToken = localStorage.getItem('apsmart_token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const fetchRoutes = async (from?: string, to?: string, type?: string): Promise<Route[]> => {
  const res = await api.get('/routes', { params: { from, to, type } });
  return res.data;
};

export const fetchRouteById = async (id: string): Promise<Route> => {
  const res = await api.get(`/routes/${id}`);
  return res.data;
};

export const fetchBuses = async (type?: string, routeId?: string): Promise<Bus[]> => {
  const res = await api.get('/buses', { params: { type, routeId } });
  return res.data;
};

export const fetchLiveTelemetry = async (): Promise<Bus[]> => {
  const res = await api.get('/buses/live/telemetry');
  return res.data;
};

export const ingestLiveTelemetry = async (ping: {
  busNumber: string;
  lat: number;
  lng: number;
  speed: number;
  heading?: number;
  accuracyMeters?: number;
  occupancyStatus?: string;
  driverName?: string;
  source?: string;
}) => {
  const res = await api.post('/telemetry/ingest', ping);
  return res.data;
};

export const fetchTelemetryStats = async () => {
  const res = await api.get('/telemetry/stats');
  return res.data;
};

export const updateExternalTransitConfig = async (config: any) => {
  const res = await api.post('/telemetry/external/config', config);
  return res.data;
};

export const updateExternalFeedConfig = updateExternalTransitConfig;

export const syncExternalTransitFeed = async () => {
  const res = await api.post('/telemetry/external/sync');
  return res.data;
};

export const fetchBusById = async (id: string): Promise<Bus> => {
  const res = await api.get(`/buses/${id}`);
  return res.data;
};

export const fetchBusLocation = async (id: string) => {
  const res = await api.get(`/buses/${id}/location`);
  return res.data;
};

export const fetchStops = async (): Promise<Stop[]> => {
  const res = await api.get('/stops');
  return res.data;
};

export const submitSurvey = async (surveyData: Partial<Survey>) => {
  const res = await api.post('/surveys', surveyData);
  return res.data;
};

export const fetchSurveys = async (routeId?: string): Promise<Survey[]> => {
  const res = await api.get('/surveys', { params: { routeId } });
  return res.data;
};

export const fetchRouteUtilisation = async (routeId?: string): Promise<RouteUtilisation[]> => {
  const res = await api.get('/analytics/utilisation', { params: { routeId } });
  return res.data;
};

export const fetchStopAnalytics = async () => {
  const res = await api.get('/analytics/stops');
  return res.data;
};

export const fetchDemandCurve = async () => {
  const res = await api.get('/analytics/demand');
  return res.data;
};

export const fetchUnderServedAreas = async (): Promise<UnderServedArea[]> => {
  const res = await api.get('/underserved-areas');
  return res.data;
};

export const recalculateUnderservedAreas = async (params: {
  distanceThresholdKm?: number;
  frequencyThresholdMins?: number;
  peakUnmetThresholdPaxHr?: number;
}): Promise<UnderServedArea[]> => {
  const res = await api.post('/underserved-areas/recalculate', params);
  return res.data;
};

export const reportTransitGap = async (gapData: {
  areaName: string;
  lat?: number;
  lng?: number;
  distanceToStopKm?: number;
  avgBusFrequencyMins?: number;
  peakDemandPaxHr?: number;
  classificationReason?: string;
}) => {
  const res = await api.post('/underserved-areas/report', gapData);
  return res.data;
};

export const createFeederRecommendationApi = async (areaId: string) => {
  const res = await api.post(`/underserved-areas/${areaId}/generate-feeder`);
  return res.data;
};

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  const res = await api.get('/recommendations');
  return res.data;
};

export const generateRecommendationsApi = async () => {
  const res = await api.post('/recommendations/generate');
  return res.data;
};

export const updateRecommendationStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
  const res = await api.patch(`/recommendations/${id}/status`, { status });
  return res.data;
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  const res = await api.get('/alerts');
  return res.data;
};

export const submitFeedback = async (feedback: any) => {
  const res = await api.post('/alerts/feedback', feedback);
  return res.data;
};

export const fetchSavedRoutes = async (): Promise<Route[]> => {
  const res = await api.get('/saved-routes');
  return res.data;
};

export const saveRouteApi = async (routeId: string) => {
  const res = await api.post('/saved-routes', { routeId });
  return res.data;
};

export const removeSavedRouteApi = async (routeId: string) => {
  const res = await api.delete(`/saved-routes/${routeId}`);
  return res.data;
};

export const fetchExecutiveReport = async () => {
  const res = await api.get('/reports/executive');
  return res.data;
};

export const fetchSurveyStats = async () => {
  const res = await api.get('/surveys/stats');
  return res.data;
};

export const bulkImportSurveysApi = async (datasetName: string, rows: any[]) => {
  const res = await api.post('/surveys/bulk-import', { datasetName, rows });
  return res.data;
};

export const loadSurveyPresetApi = async (presetId: string) => {
  const res = await api.post('/surveys/load-preset', { presetId });
  return res.data;
};

