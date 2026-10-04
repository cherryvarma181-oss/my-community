import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import routesRoutes from './routes/routes.routes';
import busesRoutes from './routes/buses.routes';
import stopsRoutes from './routes/stops.routes';
import surveysRoutes from './routes/surveys.routes';
import analyticsRoutes from './routes/analytics.routes';
import underservedRoutes from './routes/underserved.routes';
import recommendationsRoutes from './routes/recommendations.routes';
import reportsRoutes from './routes/reports.routes';
import alertsRoutes from './routes/alerts.routes';
import savedRoutes from './routes/savedRoutes.routes';
import telemetryRoutes from './routes/telemetry.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/underserved-areas', underservedRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/saved-routes', savedRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'APSMART Bus Route Intelligence API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 APSMART Server running on http://localhost:${PORT}`);
});
