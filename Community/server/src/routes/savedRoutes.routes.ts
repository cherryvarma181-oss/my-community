import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const saved = await prisma.savedRoute.findMany({
      where: { userId: req.user!.id },
      include: {
        route: {
          include: {
            buses: true,
            routeStops: { include: { stop: true }, orderBy: { sequenceOrder: 'asc' } }
          }
        }
      }
    });

    return res.json(saved.map(s => s.route));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching saved routes' });
  }
});

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { routeId } = req.body;
    if (!routeId) return res.status(400).json({ message: 'routeId required' });

    const existing = await prisma.savedRoute.findUnique({
      where: {
        userId_routeId: {
          userId: req.user!.id,
          routeId
        }
      }
    });

    if (existing) {
      return res.json({ message: 'Route already saved', saved: existing });
    }

    const saved = await prisma.savedRoute.create({
      data: {
        userId: req.user!.id,
        routeId
      }
    });

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: 'Error saving route' });
  }
});

router.delete('/:routeId', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    await prisma.savedRoute.delete({
      where: {
        userId_routeId: {
          userId: req.user!.id,
          routeId: req.params.routeId
        }
      }
    });

    return res.json({ message: 'Route removed from saved list' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing saved route' });
  }
});

export default router;
