import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { sendEmail, emailTemplates } from '../../infrastructure/email/nodemailer';
import { z } from 'zod';
import crypto from 'crypto';

// Esquemas de validación
const subscribeSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
});

export class NewsletterController {
  /**
   * Subscribe to newsletter
   * POST /api/v1/newsletter/subscribe
   */
  static async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name } = subscribeSchema.parse(req.body);

      // Verificar si ya está suscrito
      const existingSubscriber = await getPool().query(
        'SELECT * FROM newsletter_subscribers WHERE email = $1',
        [email]
      );

      if (existingSubscriber.rows.length > 0) {
        const subscriber = existingSubscriber.rows[0];

        // Si ya está suscrito y verificado
        if (subscriber.status === 'active' && subscriber.verified) {
          res.status(200).json({
            success: true,
            message: 'Ya estás suscrito a nuestro newsletter',
          });
          return;
        }

        // Si está no verificado, reenviar email de verificación
        if (!subscriber.verified) {
          const verificationToken = subscriber.verification_token;
          const template = emailTemplates.newsletterWelcome(email, verificationToken);

          await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
          });

          res.json({
            success: true,
            message: 'Te hemos reenviado el email de confirmación. Por favor, verifica tu email.',
          });
          return;
        }

        // Si se había dado de baja, reactivar
        if (subscriber.status === 'unsubscribed') {
          const verificationToken = crypto.randomBytes(32).toString('hex');

          await getPool().query(
            `UPDATE newsletter_subscribers
             SET status = 'active', verification_token = $1, unsubscribed_at = NULL, updated_at = NOW()
             WHERE email = $2`,
            [verificationToken, email]
          );

          const template = emailTemplates.newsletterWelcome(email, verificationToken);

          await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
          });

          res.json({
            success: true,
            message: '¡Bienvenido de vuelta! Te hemos enviado un email de confirmación.',
          });
          return;
        }
      }

      // Crear nuevo suscriptor
      const verificationToken = crypto.randomBytes(32).toString('hex');

      await getPool().query(
        `INSERT INTO newsletter_subscribers (email, name, verification_token, status, verified)
         VALUES ($1, $2, $3, 'active', false)`,
        [email, name || null, verificationToken]
      );

      // Enviar email de bienvenida
      const template = emailTemplates.newsletterWelcome(email, verificationToken);

      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      });

      logger.info(`Nuevo suscriptor al newsletter: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Suscripción exitosa. Por favor, verifica tu email para completar el proceso.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
        return;
      }
      logger.error('Error en suscripción al newsletter:', error);
      next(error);
    }
  }

  /**
   * Verify email subscription
   * GET /api/v1/newsletter/verify/:token
   */
  static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token de verificación requerido',
        });
        return;
      }

      // Buscar suscriptor por token
      const result = await getPool().query(
        'SELECT * FROM newsletter_subscribers WHERE verification_token = $1',
        [token]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Token de verificación inválido',
        });
        return;
      }

      const subscriber = result.rows[0];

      // Ya verificado
      if (subscriber.verified) {
        res.json({
          success: true,
          message: 'Tu email ya ha sido verificado anteriormente',
        });
        return;
      }

      // Verificar email
      await getPool().query(
        `UPDATE newsletter_subscribers
         SET verified = true, verified_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [subscriber.id]
      );

      // Enviar email de confirmación
      const template = emailTemplates.newsletterConfirmed(subscriber.email);

      await sendEmail({
        to: subscriber.email,
        subject: template.subject,
        html: template.html,
      });

      logger.info(`Email verificado para newsletter: ${subscriber.email}`);

      res.json({
        success: true,
        message: '¡Email verificado exitosamente! Ya estás suscrito a nuestro newsletter.',
      });
    } catch (error) {
      logger.error('Error verificando email:', error);
      next(error);
    }
  }

  /**
   * Unsubscribe from newsletter
   * POST /api/v1/newsletter/unsubscribe
   */
  static async unsubscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = subscribeSchema.parse(req.body);

      // Verificar si existe
      const result = await getPool().query(
        'SELECT * FROM newsletter_subscribers WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Email no encontrado en nuestra lista',
        });
        return;
      }

      const subscriber = result.rows[0];

      // Ya está dado de baja
      if (subscriber.status === 'unsubscribed') {
        res.json({
          success: true,
          message: 'Ya estabas dado de baja de nuestro newsletter',
        });
        return;
      }

      // Dar de baja
      await getPool().query(
        `UPDATE newsletter_subscribers
         SET status = 'unsubscribed', unsubscribed_at = NOW(), updated_at = NOW()
         WHERE email = $1`,
        [email]
      );

      // Enviar email de confirmación de baja
      const template = emailTemplates.newsletterUnsubscribed(email);

      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      });

      logger.info(`Usuario dado de baja del newsletter: ${email}`);

      res.json({
        success: true,
        message: 'Te hemos dado de baja de nuestro newsletter. Lamentamos verte partir.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
        return;
      }
      logger.error('Error dando de baja del newsletter:', error);
      next(error);
    }
  }

  /**
   * Get all subscribers (admin only)
   * GET /api/v1/newsletter/subscribers
   */
  static async getSubscribers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await getPool().query(
        `SELECT id, email, name, status, verified, subscribed_at, verified_at
         FROM newsletter_subscribers
         ORDER BY subscribed_at DESC`
      );

      res.json({
        success: true,
        data: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      logger.error('Error obteniendo suscriptores:', error);
      next(error);
    }
  }

  /**
   * Get newsletter statistics (admin only)
   * GET /api/v1/newsletter/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await getPool().query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'active') as active,
          COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed,
          COUNT(*) FILTER (WHERE verified = true) as verified,
          COUNT(*) FILTER (WHERE verified = false) as unverified
        FROM newsletter_subscribers
      `);

      res.json({
        success: true,
        data: stats.rows[0],
      });
    } catch (error) {
      logger.error('Error obteniendo estadísticas de newsletter:', error);
      next(error);
    }
  }
}
