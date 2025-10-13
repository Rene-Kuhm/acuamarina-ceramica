import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  return res.status(200).json({
    success: true,
    message: 'Test endpoint funcionando!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
  });
};
