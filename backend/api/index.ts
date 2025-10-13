// Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

// Handler para Vercel Serverless Functions
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Pasar la petición directamente a Express
    // Express app manejará la inicialización de DB y Redis
    return app(req, res);
  } catch (error) {
    console.error('❌ Error in serverless function:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
