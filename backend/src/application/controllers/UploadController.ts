import { Request, Response, NextFunction } from 'express';
import { cloudinary } from '../../config/cloudinary';
import { logger } from '../../shared/utils/logger';
import { getPool } from '../../infrastructure/database/connection';

export class UploadController {
  /**
   * Upload product image to Cloudinary
   * POST /api/v1/upload/product-image
   */
  static async uploadProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('📸 Iniciando upload de imagen de producto');

      if (!req.file) {
        logger.error('❌ No se proporcionó archivo');
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo',
        });
      }

      // Verificar configuración de Cloudinary
      const cloudinaryConfig = cloudinary.config();
      if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
        logger.error('❌ Cloudinary no está configurado correctamente');
        return res.status(500).json({
          success: false,
          message: 'Error de configuración del servidor (Cloudinary)',
        });
      }

      logger.info(`📦 Archivo recibido: ${req.file.originalname}, tamaño: ${req.file.size} bytes`);

      const { productId } = req.body;

      // Upload to Cloudinary
      logger.info('☁️ Subiendo a Cloudinary...');
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'aguamarina/products',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      const uploadResult = result as any;
      logger.info(`✅ Imagen subida a Cloudinary: ${uploadResult.secure_url}`);

      // If productId is provided, save to database
      if (productId) {
        logger.info(`💾 Guardando imagen en base de datos para producto ${productId}`);
        // Check if product exists
        const productCheck = await getPool().query(
          'SELECT id FROM products WHERE id = $1',
          [productId]
        );

        if (productCheck.rows.length === 0) {
          // Delete uploaded image from Cloudinary
          await cloudinary.uploader.destroy(uploadResult.public_id);
          return res.status(404).json({
            success: false,
            message: 'Producto no encontrado',
          });
        }

        // Insert image into product_images table
        const imageResult = await getPool().query(
          `INSERT INTO product_images (product_id, image_url, cloudinary_id, alt_text, is_primary, display_order)
           VALUES ($1, $2, $3, $4, $5, (SELECT COALESCE(MAX(display_order), 0) + 1 FROM product_images WHERE product_id = $1))
           RETURNING *`,
          [
            productId,
            uploadResult.secure_url,
            uploadResult.public_id,
            req.body.altText || '',
            req.body.isPrimary === 'true' || false,
          ]
        );

        // If this is set as primary, unset other primary images
        if (req.body.isPrimary === 'true') {
          await getPool().query(
            'UPDATE product_images SET is_primary = false WHERE product_id = $1 AND id != $2',
            [productId, imageResult.rows[0].id]
          );
        }

        logger.info(`Imagen subida para producto ${productId}: ${uploadResult.secure_url}`);

        return res.json({
          success: true,
          data: {
            id: imageResult.rows[0].id,
            url: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
          },
        });
      }

      // Return just the upload result without saving to database
      logger.info(`Imagen subida a Cloudinary: ${uploadResult.secure_url}`);

      res.json({
        success: true,
        data: {
          url: uploadResult.secure_url,
          cloudinaryId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
        },
      });
    } catch (error) {
      logger.error('❌ Error al subir imagen:', error);
      logger.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

      return res.status(500).json({
        success: false,
        message: 'Error al subir la imagen',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * Delete image from Cloudinary and database
   * DELETE /api/v1/upload/:imageId
   */
  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageId } = req.params;

      // Get image from database
      const imageResult = await getPool().query(
        'SELECT * FROM product_images WHERE id = $1',
        [imageId]
      );

      if (imageResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Imagen no encontrada',
        });
      }

      const image = imageResult.rows[0];

      // Delete from Cloudinary
      if (image.cloudinary_id) {
        await cloudinary.uploader.destroy(image.cloudinary_id);
      }

      // Delete from database
      await getPool().query('DELETE FROM product_images WHERE id = $1', [imageId]);

      logger.info(`Imagen eliminada: ${imageId}`);

      res.json({
        success: true,
        message: 'Imagen eliminada correctamente',
      });
    } catch (error) {
      logger.error('Error al eliminar imagen:', error);
      next(error);
    }
  }

  /**
   * Upload category image to Cloudinary
   * POST /api/v1/upload/category-image
   */
  static async uploadCategoryImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo',
        });
      }

      const { categoryId } = req.body;

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'aguamarina/categories',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      const uploadResult = result as any;

      // If categoryId is provided, update category
      if (categoryId) {
        const categoryCheck = await getPool().query(
          'SELECT id, image_url, cloudinary_id FROM categories WHERE id = $1',
          [categoryId]
        );

        if (categoryCheck.rows.length === 0) {
          // Delete uploaded image from Cloudinary
          await cloudinary.uploader.destroy(uploadResult.public_id);
          return res.status(404).json({
            success: false,
            message: 'Categoría no encontrada',
          });
        }

        const category = categoryCheck.rows[0];

        // Delete old image from Cloudinary if exists
        if (category.cloudinary_id) {
          await cloudinary.uploader.destroy(category.cloudinary_id);
        }

        // Update category with new image
        await getPool().query(
          'UPDATE categories SET image_url = $1, cloudinary_id = $2 WHERE id = $3',
          [uploadResult.secure_url, uploadResult.public_id, categoryId]
        );

        logger.info(`Imagen de categoría actualizada ${categoryId}: ${uploadResult.secure_url}`);
      }

      res.json({
        success: true,
        data: {
          url: uploadResult.secure_url,
          cloudinaryId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
        },
      });
    } catch (error) {
      logger.error('Error al subir imagen de categoría:', error);
      next(error);
    }
  }
}
