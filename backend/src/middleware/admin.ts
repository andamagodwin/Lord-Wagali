import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';
import { AppError } from '../lib/http';

export function requireAdminKey(req: Request, _res: Response, next: NextFunction) {
  const provided = req.header('x-admin-key');
  if (!provided || provided !== env.ADMIN_API_KEY) {
    return next(new AppError(401, 'Invalid admin credentials'));
  }

  return next();
}
