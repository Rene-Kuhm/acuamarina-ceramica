// Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

// Export the Express app as a Vercel serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  // Importante: No wrappear en try-catch aquí, dejamos que Express maneje los errores
  return app(req as any, res as any);
};
