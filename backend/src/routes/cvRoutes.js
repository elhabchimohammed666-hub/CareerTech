import express from 'express';
import {
  uploadMainCV,
  getMainCV,
  downloadMainCV,
  deleteMainCV,
} from '../controllers/cvController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCV } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/main', uploadCV.single('cv'), uploadMainCV);
router.get('/main', getMainCV);
router.get('/main/file', downloadMainCV);
router.delete('/main', deleteMainCV);

export default router;
