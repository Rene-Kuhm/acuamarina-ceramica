import { Request, Response } from 'express';
import { logger } from '../../shared/utils/logger';
import { sendContactEmail, sendContactConfirmation } from '../../infrastructure/email/resendService';

export class ContactController {
  /**
   * Enviar mensaje de contacto
   */
  static async send(req: Request, res: Response) {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Validar datos requeridos
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios (nombre, email, asunto, mensaje)',
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido',
        });
      }

      // Log del mensaje recibido
      logger.info('Mensaje de contacto recibido', {
        from: email,
        name,
        subject,
        hasPhone: !!phone,
      });

      // Enviar email a la empresa
      try {
        await sendContactEmail({
          name,
          email,
          phone,
          subject,
          message,
        });
        logger.info('✅ Email enviado a contacto@aguamarinamosaicos.com');
      } catch (emailError) {
        // Si falla el email a la empresa, logueamos pero no fallamos la request
        logger.error('❌ Error al enviar email a la empresa:', emailError);
      }

      // Enviar email de confirmación al usuario
      try {
        await sendContactConfirmation({
          name,
          email,
        });
        logger.info('✅ Email de confirmación enviado al usuario');
      } catch (confirmError) {
        // Si falla el email de confirmación, solo logueamos
        logger.error('❌ Error al enviar email de confirmación:', confirmError);
      }

      logger.info('📧 Mensaje de contacto procesado correctamente', {
        name,
        email,
        subject,
      });

      return res.status(200).json({
        success: true,
        message: '¡Mensaje enviado correctamente! Te responderemos pronto.',
        data: {
          name,
          email,
          subject,
        },
      });
    } catch (error) {
      logger.error('Error al procesar mensaje de contacto:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.',
      });
    }
  }

  /**
   * Obtener estadísticas de mensajes de contacto (admin)
   */
  static async getStats(req: Request, res: Response) {
    try {
      // TODO: Implementar si guardas mensajes en BD
      return res.status(200).json({
        success: true,
        message: 'Estadísticas de contacto',
        data: {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas de contacto:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
      });
    }
  }
}
