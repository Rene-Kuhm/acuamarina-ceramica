import { Request, Response } from 'express';
import { logger } from '../../shared/utils/logger';
// Si tienes nodemailer configurado, importa aquí
// import { sendEmail } from '../../infrastructure/email/emailService';

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

      // TODO: Implementar envío de email
      // Opción 1: Enviar email usando nodemailer
      // await sendEmail({
      //   to: 'contacto@aguamarinamosaicos.com',
      //   subject: `Nuevo mensaje de contacto: ${subject}`,
      //   html: `
      //     <h2>Nuevo mensaje de contacto</h2>
      //     <p><strong>Nombre:</strong> ${name}</p>
      //     <p><strong>Email:</strong> ${email}</p>
      //     <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
      //     <p><strong>Asunto:</strong> ${subject}</p>
      //     <p><strong>Mensaje:</strong></p>
      //     <p>${message}</p>
      //   `,
      // });

      // Opción 2: Guardar en base de datos (opcional)
      // await pool.query(
      //   'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      //   [name, email, phone, subject, message]
      // );

      // Por ahora, solo registramos el mensaje
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
