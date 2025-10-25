import { Router } from 'express';
import { NewsletterController } from '../controllers/NewsletterController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @route   POST /api/v1/newsletter/subscribe
 * @desc    Suscribirse al newsletter
 * @access  Public
 */
router.post('/subscribe', NewsletterController.subscribe);

/**
 * @route   GET /api/v1/newsletter/verify/:token
 * @desc    Verificar email de suscripción
 * @access  Public
 */
router.get('/verify/:token', NewsletterController.verify);

/**
 * @route   POST /api/v1/newsletter/unsubscribe
 * @desc    Darse de baja del newsletter
 * @access  Public
 */
router.post('/unsubscribe', NewsletterController.unsubscribe);

/**
 * @route   GET /api/v1/newsletter/subscribers
 * @desc    Obtener todos los suscriptores (admin)
 * @access  Private (Admin)
 */
router.get('/subscribers', authenticate, authorize('admin'), NewsletterController.getSubscribers);

/**
 * @route   GET /api/v1/newsletter/stats
 * @desc    Obtener estadísticas del newsletter (admin)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, authorize('admin'), NewsletterController.getStats);

export default router;
