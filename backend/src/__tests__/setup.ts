import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// Cargar variables de entorno de prueba
dotenvConfig({ path: path.resolve(__dirname, '../../.env.test') });

// Mock de logger para tests
jest.mock('../shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

// Configuración global de timeouts
jest.setTimeout(10000);

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
