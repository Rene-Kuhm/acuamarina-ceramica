import { Resend } from 'resend';
import { logger } from '../../shared/utils/logger';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Enviar email usando Resend (alternativa a SMTP que funciona en Railway)
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    // Validar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      logger.warn('⚠️ RESEND_API_KEY no configurada. Email no enviado.');
      logger.info('📧 Email que se enviaría:', {
        to: options.to,
        subject: options.subject,
      });
      return;
    }

    logger.info('📧 Enviando email con Resend...', {
      to: options.to,
      subject: options.subject,
    });

    // Enviar email con Resend
    const data = await resend.emails.send({
      from: options.from || `Aguamarina Mosaicos <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    logger.info('✅ Email enviado correctamente con Resend', {
      id: data.data?.id,
      to: options.to,
      subject: options.subject,
    });
  } catch (error: any) {
    logger.error('❌ Error al enviar email con Resend:', {
      message: error.message,
      statusCode: error.statusCode,
      name: error.name,
    });
    throw new Error(`Error al enviar email: ${error.message}`);
  }
};

/**
 * Enviar email de contacto a la empresa
 */
export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e0e0e0;
        }
        .info-row {
          margin: 15px 0;
          padding: 10px;
          background: white;
          border-radius: 5px;
          border-left: 4px solid #14b8a6;
        }
        .label {
          font-weight: bold;
          color: #0d9488;
          display: inline-block;
          width: 100px;
        }
        .message-box {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
          border: 1px solid #e0e0e0;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #14b8a6;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📧 Nuevo Mensaje de Contacto</h1>
        <p>Aguamarina Mosaicos</p>
      </div>

      <div class="content">
        <div class="info-row">
          <span class="label">👤 Nombre:</span>
          <span>${data.name}</span>
        </div>

        <div class="info-row">
          <span class="label">📧 Email:</span>
          <span><a href="mailto:${data.email}">${data.email}</a></span>
        </div>

        ${
          data.phone
            ? `
        <div class="info-row">
          <span class="label">📱 Teléfono:</span>
          <span><a href="tel:${data.phone}">${data.phone}</a></span>
        </div>
        `
            : ''
        }

        <div class="info-row">
          <span class="label">📋 Asunto:</span>
          <span>${data.subject}</span>
        </div>

        <div class="message-box">
          <h3 style="margin-top: 0; color: #0d9488;">💬 Mensaje:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>

      <div class="footer">
        <p>Este mensaje fue enviado desde el formulario de contacto de <strong>aguamarinamosaicos.com</strong></p>
        <p>Para responder, haz clic en el email del remitente o contáctalo al teléfono proporcionado.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: 'contacto@aguamarinamosaicos.com',
    subject: `Nuevo mensaje de contacto: ${data.subject}`,
    html,
  });
};

/**
 * Enviar email de confirmación al usuario
 */
export const sendContactConfirmation = async (data: {
  name: string;
  email: string;
}): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e0e0e0;
        }
        .button {
          display: inline-block;
          background: #14b8a6;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .contact-info {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
          border-left: 4px solid #14b8a6;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Mensaje Recibido</h1>
      </div>

      <div class="content">
        <h2>Hola ${data.name},</h2>
        <p>Gracias por contactarte con <strong>Aguamarina Mosaicos</strong>.</p>
        <p>Hemos recibido tu mensaje correctamente y te responderemos a la brevedad.</p>

        <div class="contact-info">
          <h3 style="margin-top: 0; color: #0d9488;">📍 Nuestros Locales</h3>

          <p><strong>Local Comercial:</strong><br>
          Av. Buccino y Piquillines<br>
          Playas Doradas - Sierra Grande<br>
          Río Negro, Argentina<br>
          Horario: Lun-Dom 09:00-13:30 | 17:00-23:00</p>

          <p><strong>Showroom:</strong><br>
          Palacios 254<br>
          Eduardo Castex, La Pampa<br>
          Horario: A convenir</p>

          <p><strong>Contacto:</strong><br>
          📱 WhatsApp: <a href="https://wa.me/5492334404670">2334-404670</a><br>
          📞 Tel: <a href="tel:+5492334404331">2334-404331</a><br>
          📧 Email: <a href="mailto:contacto@aguamarinamosaicos.com">contacto@aguamarinamosaicos.com</a></p>
        </div>

        <center>
          <a href="https://aguamarinamosaicos.com" class="button">Visitar Sitio Web</a>
        </center>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Si no enviaste este mensaje, puedes ignorar este email.
        </p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: data.email,
    subject: 'Mensaje recibido - Aguamarina Mosaicos',
    html,
  });
};
