import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET all stops with route counts
router.get('/', async (req, res) => {
  try {
    const stops = await prisma.stop.findMany({
      include: {
        routeStops: {
          include: { route: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return res.json(stops);
  } catch (error) {
    console.error('Error fetching stops:', error);
    return res.status(500).json({ message: 'Error fetching stops' });
  }
});

// GET buses serving a specific stop
router.get('/:id/buses', async (req, res) => {
  try {
    const routeStops = await prisma.routeStop.findMany({
      where: { stopId: req.params.id },
      select: { routeId: true }
    });

    const routeIds = routeStops.map(rs => rs.routeId);

    const buses = await prisma.bus.findMany({
      where: { currentRouteId: { in: routeIds } },
      include: { currentRoute: true }
    });

    return res.json(buses);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching buses for stop' });
  }
});

export default router;
