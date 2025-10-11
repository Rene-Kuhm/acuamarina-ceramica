import { Router } from 'express';
import { ExportController } from '../controllers/ExportController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/export/products
 * @desc    Export all products to CSV
 * @access  Private (Admin/Manager)
 */
router.get('/products', authenticate, authorize('admin', 'manager'), ExportController.exportProducts);

/**
 * @route   GET /api/v1/export/orders
 * @desc    Export orders to CSV (with optional filters)
 * @access  Private (Admin/Manager)
 */
router.get('/orders', authenticate, authorize('admin', 'manager'), ExportController.exportOrders);

/**
 * @route   GET /api/v1/export/customers
 * @desc    Export all customers to CSV
 * @access  Private (Admin/Manager)
 */
router.get('/customers', authenticate, authorize('admin', 'manager'), ExportController.exportCustomers);

export default router;
