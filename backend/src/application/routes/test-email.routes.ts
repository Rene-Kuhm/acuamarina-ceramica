import { Router, Request, Response } from 'express';
import { sendEmail } from '../../infrastructure/email/resendService';
import { logger } from '../../shared/utils/logger';

const router = Router();

/**
 * Endpoint de prueba para verificar el envío de emails
 * GET /api/v1/test-email?to=tu@email.com
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const toEmail = req.query.to as string || 'contacto@aguamarinamosaicos.com';

    logger.info('🧪 Probando envío de email...', { to: toEmail });

    // Verificar variables de entorno
    const config = {
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) || 'NO CONFIGURADA',
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    };

    logger.info('📋 Configuración de Resend:', config);

    // Intentar enviar email de prueba
    await sendEmail({
      to: toEmail,
      subject: '🧪 Test Email - Aguamarina Mosaicos',
      html: `
        <h1>Email de Prueba</h1>
        <p>Este es un email de prueba del sistema de contacto de Aguamarina Mosaicos.</p>
        <p><strong>Configuración:</strong></p>
        <ul>
          <li>API Key configurada: ${config.hasApiKey ? '✅ Sí' : '❌ No'}</li>
          <li>API Key (inicio): ${config.apiKeyPrefix}</li>
          <li>From Email: ${config.fromEmail}</li>
          <li>To Email: ${toEmail}</li>
          <li>Timestamp: ${new Date().toISOString()}</li>
        </ul>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      config,
      sentTo: toEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('❌ Error en test de email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar email de prueba',
      error: {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
        stack: error.stack,
      },
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) || 'NO CONFIGURADA',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      },
    });
  }
});

export default router;
