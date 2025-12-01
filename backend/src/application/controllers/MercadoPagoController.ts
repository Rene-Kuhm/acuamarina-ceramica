import { Request, Response, NextFunction } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { getPool } from '../../infrastructure/database/connection';
import { config } from '../../config/environment';
import { logger } from '../../shared/utils/logger';

// Lazy initialization helpers
let mercadoPagoClient: MercadoPagoConfig | null = null;
let preferenceClient: Preference | null = null;
let paymentClient: Payment | null = null;

function initializeMercadoPago() {
  if (!mercadoPagoClient) {
    if (!config.mercadopago.accessToken) {
      throw new Error('MercadoPago access token no está configurado');
    }
    mercadoPagoClient = new MercadoPagoConfig({
      accessToken: config.mercadopago.accessToken,
    });
    preferenceClient = new Preference(mercadoPagoClient);
    paymentClient = new Payment(mercadoPagoClient);
  }
  return { preferenceClient: preferenceClient!, paymentClient: paymentClient! };
}

export class MercadoPagoController {
  /**
   * Create payment preference for an order
   * POST /api/v1/mercadopago/create-preference
   */
  static async createPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID es requerido',
        });
      }

      // Obtener orden de la base de datos
      const orderResult = await getPool().query(
        `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
                o.total, o.status,
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'price', oi.price,
                'subtotal', oi.subtotal
              )
            )
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
          ) as items
         FROM orders o
         WHERE o.id = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada',
        });
      }

      const order = orderResult.rows[0];

      // Inicializar MercadoPago
      const { preferenceClient: mpPreferenceClient } = initializeMercadoPago();

      // Crear preferencia de pago
      const preference = await mpPreferenceClient.create({
        body: {
          items: order.items.map((item: any) => ({
            id: String(item.product_id),
            title: item.product_name,
            quantity: item.quantity,
            unit_price: parseFloat(item.price),
            currency_id: 'ARS',
          })),
          payer: {
            name: order.customer_name,
            email: order.customer_email,
            phone: {
              number: order.customer_phone,
            },
          },
          back_urls: {
            success: `${process.env.FRONTEND_URL || 'https://acuamarina-ceramica.vercel.app'}/pedidos/success`,
            failure: `${process.env.FRONTEND_URL || 'https://acuamarina-ceramica.vercel.app'}/pedidos/failure`,
            pending: `${process.env.FRONTEND_URL || 'https://acuamarina-ceramica.vercel.app'}/pedidos/pending`,
          },
          auto_return: 'approved',
          external_reference: order.order_number,
          notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/${config.apiVersion}/mercadopago/webhook`,
          statement_descriptor: 'AGUAMARINA MOSAICOS',
        },
      });

      logger.info(`Preferencia de MercadoPago creada para orden ${order.order_number}`);

      res.json({
        success: true,
        data: {
          preferenceId: preference.id,
          initPoint: preference.init_point,
          sandboxInitPoint: preference.sandbox_init_point,
        },
      });
    } catch (error) {
      logger.error('Error creando preferencia de MercadoPago:', error);
      next(error);
    }
  }

  /**
   * Webhook handler for payment notifications
   * POST /api/v1/mercadopago/webhook
   */
  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, data } = req.body;

      logger.info(`Webhook recibido de MercadoPago: ${type}`, data);

      // Responder inmediatamente a MercadoPago
      res.sendStatus(200);

      // Procesar notificación de forma asíncrona
      if (type === 'payment') {
        const paymentId = data.id;

        try {
          // Inicializar MercadoPago
          const { paymentClient: mpPaymentClient } = initializeMercadoPago();

          // Obtener información del pago
          const payment = await mpPaymentClient.get({ id: paymentId });

          const externalReference = payment.external_reference;
          const status = payment.status;

          logger.info(`Pago ${paymentId} - Estado: ${status} - Ref: ${externalReference}`);

          // Actualizar estado del pedido según el estado del pago
          let orderStatus = 'pending';
          let paymentStatus = 'pending';

          switch (status) {
            case 'approved':
              orderStatus = 'confirmed';
              paymentStatus = 'completed';
              break;
            case 'pending':
            case 'in_process':
              orderStatus = 'pending';
              paymentStatus = 'pending';
              break;
            case 'rejected':
            case 'cancelled':
              orderStatus = 'cancelled';
              paymentStatus = 'failed';
              break;
            case 'refunded':
            case 'charged_back':
              orderStatus = 'cancelled';
              paymentStatus = 'refunded';
              break;
          }

          // Actualizar orden en la base de datos
          await getPool().query(
            `UPDATE orders
             SET status = $1, payment_status = $2, mercadopago_payment_id = $3, updated_at = NOW()
             WHERE order_number = $4`,
            [orderStatus, paymentStatus, String(paymentId), externalReference]
          );

          logger.info(`Orden ${externalReference} actualizada: ${orderStatus} / ${paymentStatus}`);
        } catch (error) {
          logger.error('Error procesando webhook de pago:', error);
        }
      }
    } catch (error) {
      logger.error('Error en webhook de MercadoPago:', error);
      // No llamar next() porque ya respondimos
    }
  }

  /**
   * Get payment status
   * GET /api/v1/mercadopago/payment/:paymentId
   */
  static async getPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;

      // Inicializar MercadoPago
      const { paymentClient: mpPaymentClient } = initializeMercadoPago();

      const payment = await mpPaymentClient.get({ id: paymentId });

      res.json({
        success: true,
        data: {
          id: payment.id,
          status: payment.status,
          statusDetail: payment.status_detail,
          externalReference: payment.external_reference,
          transactionAmount: payment.transaction_amount,
          dateApproved: payment.date_approved,
        },
      });
    } catch (error) {
      logger.error('Error obteniendo estado de pago:', error);
      next(error);
    }
  }

  /**
   * Get public key for frontend
   * GET /api/v1/mercadopago/public-key
   */
  static async getPublicKey(req: Request, res: Response) {
    res.json({
      success: true,
      data: {
        publicKey: config.mercadopago.publicKey,
      },
    });
  }
}
