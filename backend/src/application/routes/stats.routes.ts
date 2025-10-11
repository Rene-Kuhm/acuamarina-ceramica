import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/stats/dashboard
 * @desc    Get dashboard statistics
 * @access  Private (Admin/Manager)
 */
router.get('/dashboard', authenticate, authorize('admin', 'manager'), StatsController.getDashboard);

export default router;
