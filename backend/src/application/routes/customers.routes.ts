import { Router } from 'express';
import { CustomersController } from '../controllers/CustomersController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/customers
 * @desc    Get all customers with pagination and filters
 * @access  Private (Admin/Manager)
 */
router.get('/', authenticate, authorize('admin', 'manager'), CustomersController.getAll);

/**
 * @route   GET /api/v1/customers/stats
 * @desc    Get customer statistics
 * @access  Private (Admin/Manager)
 */
router.get('/stats', authenticate, authorize('admin', 'manager'), CustomersController.getStats);

/**
 * @route   GET /api/v1/customers/:id
 * @desc    Get customer by ID
 * @access  Private (Admin/Manager)
 */
router.get('/:id', authenticate, authorize('admin', 'manager'), CustomersController.getById);

/**
 * @route   GET /api/v1/customers/:id/orders
 * @desc    Get customer order history
 * @access  Private (Admin/Manager)
 */
router.get('/:id/orders', authenticate, authorize('admin', 'manager'), CustomersController.getOrderHistory);

export default router;
