// Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

// Wrapper para convertir Express app en Vercel handler
export default (req: VercelRequest, res: VercelResponse) => {
  return new Promise((resolve, reject) => {
    // Crear un mock de res.end para capturar cuando Express termina
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      res.end = originalEnd;
      res.end.apply(res, args);
      resolve(undefined);
    };

    // Pasar la request a Express
    app(req as any, res as any);
  });
};
