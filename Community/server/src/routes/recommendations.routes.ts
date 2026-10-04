import { Router } from 'express';
import { prisma } from '../config/db';
import { generateRouteRecommendations, computeFreshRecommendations, applyApprovedRecommendation } from '../analytics/recommendationEngine';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// GET all recommendations
router.get('/', async (req, res) => {
  try {
    const recommendations = await generateRouteRecommendations();
    return res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// Trigger dynamic calculation of recommendations based on live route utilisations and unserved areas
router.post('/generate', async (req, res) => {
  try {
    const recommendations = await computeFreshRecommendations();
    return res.json({
      message: 'Algorithmic recommendations refreshed successfully',
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Error generating fresh recommendations:', error);
    return res.status(500).json({ message: 'Error generating recommendations' });
  }
});

// Update recommendation status (APPROVE / REJECT)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const rec = await prisma.recommendation.update({
      where: { id: req.params.id },
      data: { status }
    });

    let appliedAction = undefined;
    if (status === 'APPROVED') {
      const result = await applyApprovedRecommendation(req.params.id);
      appliedAction = result.appliedAction;
    }

    return res.json({
      ...rec,
      appliedAction
    });
  } catch (error) {
    console.error('Error updating recommendation status:', error);
    return res.status(500).json({ message: 'Error updating recommendation status' });
  }
});

// Add custom recommendation
router.post('/', async (req, res) => {
  try {
    const { targetAreaOrRoute, title, recommendationType, details, reason, expectedImpact, confidencePercent, priority } = req.body;

    const rec = await prisma.recommendation.create({
      data: {
        targetAreaOrRoute,
        title,
        recommendationType,
        details,
        reason,
        expectedImpact,
        confidencePercent: Number(confidencePercent) || 85,
        status: 'PENDING',
        priority: priority || 'HIGH'
      }
    });

    return res.status(201).json(rec);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating recommendation' });
  }
});

export default router;
