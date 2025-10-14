import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '/';
  const path = url.replace(/^\/api/, '');

  // Health
  if (path === '/health') {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // API v1
  if (path === '/' || path === '/v1' || path === '/v1/') {
    return res.json({
      message: 'API Aguamarina Mosaicos CORS Fixed',
      version: 'v1',
      status: 'online',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        auth: '/api/v1/auth/login',
        products: '/api/v1/products',
        categories: '/api/v1/categories',
      },
    });
  }

  // Default 404
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path,
    method: req.method,
  });
}
