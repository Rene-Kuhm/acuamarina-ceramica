import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contacto
 *                 example: juan@example.com
 *               phone:
 *                 type: string
 *                 description: Teléfono (opcional)
 *                 example: 2334-404670
 *               subject:
 *                 type: string
 *                 description: Asunto del mensaje
 *                 example: Consulta sobre productos
 *               message:
 *                 type: string
 *                 description: Mensaje
 *                 example: Me gustaría recibir más información sobre...
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ¡Mensaje enviado correctamente! Te responderemos pronto.
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El email es obligatorio')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('El teléfono no puede tener más de 20 caracteres'),
    body('subject')
      .trim()
      .notEmpty()
      .withMessage('El asunto es obligatorio')
      .isLength({ min: 3, max: 200 })
      .withMessage('El asunto debe tener entre 3 y 200 caracteres'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('El mensaje es obligatorio')
      .isLength({ min: 10, max: 2000 })
      .withMessage('El mensaje debe tener entre 10 y 2000 caracteres'),
    validateRequest,
  ],
  ContactController.send
);

/**
 * @swagger
 * /contact/stats:
 *   get:
 *     summary: Obtener estadísticas de mensajes de contacto (Admin)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 *       401:
 *         description: No autorizado
 */
router.get('/stats', ContactController.getStats);

export default router;
