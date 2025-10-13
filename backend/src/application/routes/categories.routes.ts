import { Router } from 'express';
import { CategoriesController } from '../controllers/CategoriesController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', CategoriesController.getAll);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', CategoriesController.getById);

/**
 * @route   POST /api/v1/categories
 * @desc    Create new category
 * @access  Private (Admin/Manager)
 */
router.post('/', authenticate, authorize('admin', 'manager'), CategoriesController.create);

/**
 * @route   PATCH /api/v1/categories/:id
 * @desc    Update category
 * @access  Private (Admin/Manager)
 */
router.patch('/:id', authenticate, authorize('admin', 'manager'), CategoriesController.update);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), CategoriesController.delete);

export default router;
