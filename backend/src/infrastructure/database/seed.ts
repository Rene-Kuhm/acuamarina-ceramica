import bcrypt from 'bcryptjs';
import { getPool, connectDatabase, disconnectDatabase } from './connection';
import { logger } from '../../shared/utils/logger';

const seedDatabase = async () => {
  try {
    logger.info('Iniciando seed de base de datos...');

    await connectDatabase();
    const pool = getPool();

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@aguamarina.com', hashedPassword, 'admin', 'Admin', 'aguamarina', true, true]
    );

    logger.info('✓ Usuario admin creado');

    // Crear categorías
    const categoriesData = [
      {
        name: 'Pisos Cerámicos',
        slug: 'pisos-mosaicos',
        description: 'Cerámicos de alta calidad para pisos interiores y exteriores',
        displayOrder: 1,
      },
      {
        name: 'Revestimientos',
        slug: 'revestimientos',
        description: 'Revestimientos cerámicos para paredes',
        displayOrder: 2,
      },
      {
        name: 'Porcellanatos',
        slug: 'porcellanatos',
        description: 'Porcellanatos de primera calidad con acabados premium',
        displayOrder: 3,
      },
      {
        name: 'Sanitarios',
        slug: 'sanitarios',
        description: 'Sanitarios, lavabos y accesorios para baño',
        displayOrder: 4,
      },
      {
        name: 'Mosaicos',
        slug: 'mosaicos',
        description: 'Mosaicos decorativos para diseños especiales',
        displayOrder: 5,
      },
    ];

    for (const category of categoriesData) {
      await pool.query(
        `INSERT INTO categories (name, slug, description, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO NOTHING`,
        [category.name, category.slug, category.description, category.displayOrder, true]
      );
    }

    logger.info('✓ Categorías creadas');

    // Obtener ID de categoría para productos de ejemplo
    const categoryResult = await pool.query(
      `SELECT id FROM categories WHERE slug = $1`,
      ['pisos-mosaicos']
    );

    if (categoryResult.rows.length > 0) {
      const categoryId = categoryResult.rows[0].id;

      // Crear productos de ejemplo
      const productsData = [
        {
          sku: 'CER-60X60-001',
          name: 'Cerámico Mármol Carrara 60x60',
          slug: 'ceramico-marmol-carrara-60x60',
          description:
            'Cerámico símil mármol Carrara de primera calidad, ideal para espacios elegantes',
          shortDescription: 'Cerámico 60x60 símil mármol Carrara',
          categoryId,
          price: 2850.0,
          comparePrice: 3200.0,
          costPrice: 1900.0,
          dimensions: '60x60 cm',
          weight: 18.5,
          material: 'Cerámica',
          finish: 'Brillante',
          color: 'Blanco con vetas grises',
          stockQuantity: 150,
          lowStockThreshold: 20,
          isFeatured: true,
        },
        {
          sku: 'CER-45X45-002',
          name: 'Cerámico Rústico Madera 45x45',
          slug: 'ceramico-rustico-madera-45x45',
          description: 'Cerámico de aspecto rústico símil madera, perfecto para ambientes cálidos',
          shortDescription: 'Cerámico 45x45 símil madera',
          categoryId,
          price: 1950.0,
          costPrice: 1300.0,
          dimensions: '45x45 cm',
          weight: 12.0,
          material: 'Cerámica',
          finish: 'Mate',
          color: 'Marrón madera',
          stockQuantity: 200,
          lowStockThreshold: 30,
          isFeatured: true,
        },
      ];

      for (const product of productsData) {
        await pool.query(
          `INSERT INTO products (
            sku, name, slug, description, short_description, category_id,
            price, compare_price, cost_price, dimensions, weight, material,
            finish, color, stock_quantity, low_stock_threshold, is_active, is_featured
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (sku) DO NOTHING`,
          [
            product.sku,
            product.name,
            product.slug,
            product.description,
            product.shortDescription,
            product.categoryId,
            product.price,
            product.comparePrice || null,
            product.costPrice,
            product.dimensions,
            product.weight,
            product.material,
            product.finish,
            product.color,
            product.stockQuantity,
            product.lowStockThreshold,
            true,
            product.isFeatured,
          ]
        );
      }

      logger.info('✓ Productos de ejemplo creados');
    }

    logger.info('✓ Seed completado exitosamente');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error ejecutando seed:', error);
    process.exit(1);
  }
};

seedDatabase();
