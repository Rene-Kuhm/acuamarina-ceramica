import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authenticate, authorize } from '../middleware/authenticate';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * @route   POST /api/v1/upload/product-image
 * @desc    Upload product image to Cloudinary
 * @access  Private (Admin/Manager)
 */
router.post(
  '/product-image',
  authenticate,
  authorize('admin', 'manager'),
  upload.single('image'),
  UploadController.uploadProductImage
);

/**
 * @route   POST /api/v1/upload/category-image
 * @desc    Upload category image to Cloudinary
 * @access  Private (Admin/Manager)
 */
router.post(
  '/category-image',
  authenticate,
  authorize('admin', 'manager'),
  upload.single('image'),
  UploadController.uploadCategoryImage
);

/**
 * @route   DELETE /api/v1/upload/:imageId
 * @desc    Delete image from Cloudinary and database
 * @access  Private (Admin/Manager)
 */
router.delete(
  '/:imageId',
  authenticate,
  authorize('admin', 'manager'),
  UploadController.deleteImage
);

export default router;
