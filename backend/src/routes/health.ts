import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'lord-wagali-backend',
    timestamp: new Date().toISOString(),
  });
});
