import { Router } from 'express';
import { buildExecutiveReportData } from '../utils/pdfGenerator';

const router = Router();

router.get('/executive', async (req, res) => {
  try {
    const reportData = await buildExecutiveReportData();
    return res.json(reportData);
  } catch (error) {
    console.error('Error generating report data:', error);
    return res.status(500).json({ message: 'Error generating report data' });
  }
});

export default router;
