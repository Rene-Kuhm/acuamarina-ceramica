import nodemailer from 'nodemailer';
import { config } from '../../config/environment';
import { logger } from '../../shared/utils/logger';

// Crear transportador de email
let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (!transporter) {
    // Configuración para Gmail
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    // Verificar la conexión
    transporter.verify((error) => {
      if (error) {
        logger.error('Error en configuración de email:', error);
      } else {
        logger.info('✅ Servidor de email configurado correctamente');
      }
    });
  }

  return transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const transporter = getEmailTransporter();

  const mailOptions = {
    from: `"${config.email.fromName}" <${config.email.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error enviando email:', error);
    throw error;
  }
}

// Templates de email
export const emailTemplates = {
  newsletterWelcome: (email: string, verificationToken: string) => {
    const verificationUrl = `${config.frontendUrl}/newsletter/verify?token=${verificationToken}`;

    return {
      subject: '¡Bienvenido al Newsletter de Aguamarina Mosaicos!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
              .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Bienvenido a Aguamarina Mosaicos!</h1>
              </div>
              <div class="content">
                <p>¡Hola!</p>

                <p>Gracias por suscribirte a nuestro newsletter. Estamos emocionados de tenerte con nosotros.</p>

                <p>Para confirmar tu suscripción y empezar a recibir nuestras ofertas exclusivas y novedades, por favor haz clic en el siguiente botón:</p>

                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Confirmar Suscripción</a>
                </div>

                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #14b8a6;">${verificationUrl}</p>

                <p>¿Qué te espera?</p>
                <ul>
                  <li>🎁 Ofertas exclusivas para suscriptores</li>
                  <li>📢 Nuevos productos antes que nadie</li>
                  <li>💡 Tips y consejos de decoración</li>
                  <li>🎯 Promociones especiales</li>
                </ul>

                <p>¡Gracias por elegirnos!</p>

                <p>Saludos,<br>El equipo de Aguamarina Mosaicos</p>
              </div>
              <div class="footer">
                <p>Si no te suscribiste a este newsletter, puedes ignorar este email.</p>
                <p>© ${new Date().getFullYear()} Aguamarina Mosaicos. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  },

  newsletterConfirmed: (email: string) => ({
    subject: '✅ Suscripción Confirmada - Aguamarina Mosaicos',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Suscripción Confirmada!</h1>
            </div>
            <div class="content">
              <p>¡Excelente!</p>

              <p>Tu suscripción ha sido confirmada exitosamente. Ahora formas parte de nuestra comunidad.</p>

              <p>Pronto comenzarás a recibir:</p>
              <ul>
                <li>Las mejores ofertas y promociones</li>
                <li>Novedades sobre nuevos productos</li>
                <li>Consejos de decoración y diseño</li>
                <li>Contenido exclusivo para suscriptores</li>
              </ul>

              <p>¡Gracias por tu confianza!</p>

              <p>Saludos,<br>El equipo de Aguamarina Mosaicos</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Aguamarina Mosaicos. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newsletterUnsubscribed: (email: string) => ({
    subject: 'Suscripción Cancelada - Aguamarina Mosaicos',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Suscripción Cancelada</h1>
            </div>
            <div class="content">
              <p>Hola,</p>

              <p>Lamentamos verte partir. Tu suscripción al newsletter de Aguamarina Mosaicos ha sido cancelada.</p>

              <p>Ya no recibirás nuestros emails.</p>

              <p>Si cambiaste de opinión, siempre puedes volver a suscribirte desde nuestro sitio web.</p>

              <p>¡Esperamos verte pronto!</p>

              <p>Saludos,<br>El equipo de Aguamarina Mosaicos</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Aguamarina Mosaicos. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
