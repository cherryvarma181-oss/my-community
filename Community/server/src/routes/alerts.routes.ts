import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all active alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        route: { select: { routeNumber: true, name: true } },
        bus: { select: { busNumber: true, busType: true } }
      },
      orderBy: { timestamp: 'desc' }
    });

    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching alerts' });
  }
});

// POST passenger feedback (overcrowding / delay report)
router.post('/feedback', async (req, res) => {
  try {
    const { busId, routeId, stopId, feedbackType, comments, rating } = req.body;

    const feedback = await prisma.passengerFeedback.create({
      data: {
        busId: busId || null,
        routeId: routeId || null,
        stopId: stopId || null,
        feedbackType: feedbackType || 'OVERCROWDING',
        comments: comments || 'Passenger delay reported',
        rating: Number(rating) || 3
      }
    });

    return res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting feedback' });
  }
});

export default router;
