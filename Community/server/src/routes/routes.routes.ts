import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET all routes with stop count and buses
router.get('/', async (req, res) => {
  try {
    const { from, to, type } = req.query;

    let routes = await prisma.route.findMany({
      include: {
        routeStops: {
          include: { stop: true },
          orderBy: { sequenceOrder: 'asc' }
        },
        buses: true
      },
      orderBy: { routeNumber: 'asc' }
    });

    // Filter by stop A -> stop B
    if (from || to) {
      routes = routes.filter(route => {
        const stopNames = route.routeStops.map(rs => rs.stop.name.toLowerCase());
        const fromMatch = !from || stopNames.some(name => name.includes(String(from).toLowerCase()));
        const toMatch = !to || stopNames.some(name => name.includes(String(to).toLowerCase()));
        return fromMatch && toMatch;
      });
    }

    // Filter by bus type
    if (type && type !== 'ALL') {
      routes = routes.filter(route =>
        route.buses.some(b => b.busType.toUpperCase() === String(type).toUpperCase())
      );
    }

    return res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return res.status(500).json({ message: 'Error fetching routes' });
  }
});

// GET route details by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: {
        routeStops: {
          include: { stop: true },
          orderBy: { sequenceOrder: 'asc' }
        },
        buses: true,
        utilisations: true
      }
    });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    return res.json(route);
  } catch (error) {
    console.error('Error fetching route details:', error);
    return res.status(500).json({ message: 'Error fetching route details' });
  }
});

// GET stops for a specific route
router.get('/:id/stops', async (req, res) => {
  try {
    const routeStops = await prisma.routeStop.findMany({
      where: { routeId: req.params.id },
      include: { stop: true },
      orderBy: { sequenceOrder: 'asc' }
    });

    return res.json(routeStops);
  } catch (error) {
    console.error('Error fetching route stops:', error);
    return res.status(500).json({ message: 'Error fetching route stops' });
  }
});

export default router;
