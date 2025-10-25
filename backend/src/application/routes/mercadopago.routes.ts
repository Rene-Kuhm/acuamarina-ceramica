import { Router } from 'express';
import { MercadoPagoController } from '../controllers/MercadoPagoController';

const router = Router();

/**
 * @route   POST /api/v1/mercadopago/create-preference
 * @desc    Create payment preference for an order
 * @access  Public
 */
router.post('/create-preference', MercadoPagoController.createPreference);

/**
 * @route   POST /api/v1/mercadopago/webhook
 * @desc    Receive payment notifications from MercadoPago
 * @access  Public (MercadoPago)
 */
router.post('/webhook', MercadoPagoController.handleWebhook);

/**
 * @route   GET /api/v1/mercadopago/payment/:paymentId
 * @desc    Get payment status
 * @access  Public
 */
router.get('/payment/:paymentId', MercadoPagoController.getPaymentStatus);

/**
 * @route   GET /api/v1/mercadopago/public-key
 * @desc    Get MercadoPago public key for frontend
 * @access  Public
 */
router.get('/public-key', MercadoPagoController.getPublicKey);

export default router;
