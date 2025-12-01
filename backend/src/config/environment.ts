import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // Servidor
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  apiVersion: process.env.API_VERSION || 'v1',

  // Base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'aguamarina_mosaicos',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // CORS
  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Leer de CORS_ORIGINS o CORS_ORIGIN (ambas variantes)
      const corsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '';
      const allowedOrigins = corsEnv.split(',').map(o => o.trim()).filter(Boolean);

      const allowedPatterns = [
        /^https:\/\/.*\.vercel\.app$/,              // Any Vercel deployment
        /^https:\/\/acuamarina.*\.vercel\.app$/,    // Specific Aguamarina deployments
        /^http:\/\/localhost:\d+$/,                  // Local development
        /^https:\/\/localhost:\d+$/,                 // Local development HTTPS
      ];

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Origin allowed: ${origin}`);
        return callback(null, true);
      }

      // Check if origin matches any pattern
      const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));

      if (isAllowed) {
        console.log(`✅ CORS: Origin matches pattern: ${origin}`);
        return callback(null, true);
      }

      // Log blocked origin for debugging
      console.warn(`⚠️ CORS blocked: ${origin} | Allowed: ${allowedOrigins.join(', ') || 'patterns only'}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
    exposedHeaders: ['Authorization', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // MercadoPago
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
  },

  // Email (Gmail)
  email: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Aguamarina Mosaicos',
  },

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
};

// Validar configuración crítica
if (!config.jwt.secret || config.jwt.secret === 'your_secret_key') {
  console.warn('⚠️  ADVERTENCIA: JWT_SECRET no está configurado correctamente');
}

if (!config.database.password) {
  console.warn('⚠️  ADVERTENCIA: DB_PASSWORD no está configurada');
}
