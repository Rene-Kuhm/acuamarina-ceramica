import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

/**
 * @route   GET /api/v1/reviews/product/:productId
 * @desc    Obtener reseñas de un producto
 * @access  Public
 */
router.get('/product/:productId', ReviewController.getProductReviews);

/**
 * @route   POST /api/v1/reviews
 * @desc    Crear una reseña
 * @access  Private
 */
router.post('/', authenticate, ReviewController.createReview);

/**
 * @route   PUT /api/v1/reviews/:id
 * @desc    Actualizar una reseña
 * @access  Private
 */
router.put('/:id', authenticate, ReviewController.updateReview);

/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Eliminar una reseña
 * @access  Private
 */
router.delete('/:id', authenticate, ReviewController.deleteReview);

export default router;
