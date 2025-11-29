import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/v1/users/profile - Get current user profile
router.get('/profile', UsersController.getProfile);

// PUT /api/v1/users/profile - Update user profile
router.put('/profile', UsersController.updateProfile);

// PUT /api/v1/users/password - Update user password
router.put('/password', UsersController.updatePassword);

export default router;
