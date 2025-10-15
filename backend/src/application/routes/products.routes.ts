import { Router } from 'express';
import { ProductsController } from '../controllers/ProductsController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with pagination and filters
 * @access  Public
 */
router.get('/', ProductsController.getAll);

/**
 * @route   GET /api/v1/products/destacados
 * @desc    Get featured products
 * @access  Public
 */
router.get('/destacados', ProductsController.getFeatured);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', ProductsController.getById);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (Admin/Manager)
 */
router.post('/', authenticate, authorize('admin', 'manager'), ProductsController.create);

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Update product
 * @access  Private (Admin/Manager)
 */
router.patch('/:id', authenticate, authorize('admin', 'manager'), ProductsController.update);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), ProductsController.delete);

export default router;
