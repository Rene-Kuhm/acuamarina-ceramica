import { Router } from 'express';
import { AddressController } from '../controllers/AddressController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/v1/addresses
 * @desc    Obtener todas las direcciones del usuario
 * @access  Private
 */
router.get('/', AddressController.getAll);

/**
 * @route   GET /api/v1/addresses/:id
 * @desc    Obtener una dirección específica
 * @access  Private
 */
router.get('/:id', AddressController.getById);

/**
 * @route   POST /api/v1/addresses
 * @desc    Crear nueva dirección
 * @access  Private
 */
router.post('/', AddressController.create);

/**
 * @route   PUT /api/v1/addresses/:id
 * @desc    Actualizar dirección
 * @access  Private
 */
router.put('/:id', AddressController.update);

/**
 * @route   DELETE /api/v1/addresses/:id
 * @desc    Eliminar dirección
 * @access  Private
 */
router.delete('/:id', AddressController.delete);

/**
 * @route   PATCH /api/v1/addresses/:id/set-default
 * @desc    Establecer dirección como predeterminada
 * @access  Private
 */
router.patch('/:id/set-default', AddressController.setDefault);

export default router;
