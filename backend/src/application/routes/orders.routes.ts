import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order (public endpoint for customers)
 * @access  Public
 */
router.post('/', OrdersController.create);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders with pagination and filters
 * @access  Private (Admin/Manager)
 */
router.get('/', authenticate, authorize('admin', 'manager'), OrdersController.getAll);

/**
 * @route   GET /api/v1/orders/stats
 * @desc    Get order statistics
 * @access  Private (Admin/Manager)
 */
router.get('/stats', authenticate, authorize('admin', 'manager'), OrdersController.getStats);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Private (Admin/Manager)
 */
router.get('/:id', authenticate, authorize('admin', 'manager'), OrdersController.getById);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin/Manager)
 */
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), OrdersController.updateStatus);

export default router;
