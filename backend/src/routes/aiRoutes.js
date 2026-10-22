import express from 'express';
import {
  analyzeCV,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  exportAnalysisPDF,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCV } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', uploadCV.single('customCV'), analyzeCV);
router.get('/history', getAnalysisHistory);
router.get('/history/:id', getAnalysisById);
router.delete('/history/:id', deleteAnalysis);
router.get('/history/:id/pdf', exportAnalysisPDF);

export default router;
