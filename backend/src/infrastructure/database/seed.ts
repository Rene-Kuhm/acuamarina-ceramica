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

    // NOTA: Las categorías deben ser creadas por el dueño desde el panel de administración
    // No se crean categorías de prueba automáticamente para evitar datos ficticios

    /* CATEGORÍAS DESHABILITADAS - El dueño debe crearlas desde el admin dashboard
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
    */

    logger.info('✓ Categorías omitidas (deben crearse desde el admin)');

    logger.info('✓ Seed completado exitosamente');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error ejecutando seed:', error);
    process.exit(1);
  }
};

seedDatabase();
