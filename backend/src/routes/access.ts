import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { asyncHandler, AppError } from '../lib/http';
import { requireAdminKey } from '../middleware/admin';

export const accessRouter = Router();

const deviceIdSchema = z.string().trim().min(4).max(32).transform(value => value.toUpperCase());

accessRouter.get('/me/:deviceId', asyncHandler(async (req, res) => {
  const deviceId = deviceIdSchema.parse(req.params.deviceId);
  const access = await prisma.deviceAccess.findUnique({ where: { deviceId } });

  res.json({
    deviceId,
    isVip: access?.isVip ?? false,
    exists: Boolean(access),
  });
}));

accessRouter.post('/activate', asyncHandler(async (req, res) => {
  const body = z.object({ deviceId: deviceIdSchema }).parse(req.body);
  const access = await prisma.deviceAccess.upsert({
    where: { deviceId: body.deviceId },
    update: { isVip: true },
    create: { deviceId: body.deviceId, isVip: true },
  });

  res.status(200).json({
    deviceId: access.deviceId,
    isVip: access.isVip,
  });
}));

accessRouter.get('/authorized', requireAdminKey, asyncHandler(async (_req, res) => {
  const access = await prisma.deviceAccess.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  res.json(access);
}));

accessRouter.post('/authorize', requireAdminKey, asyncHandler(async (req, res) => {
  const body = z.object({ deviceId: deviceIdSchema }).parse(req.body);
  const access = await prisma.deviceAccess.upsert({
    where: { deviceId: body.deviceId },
    update: { isVip: true },
    create: { deviceId: body.deviceId, isVip: true },
  });

  res.status(201).json(access);
}));

accessRouter.delete('/authorize/:deviceId', requireAdminKey, asyncHandler(async (req, res) => {
  const deviceId = deviceIdSchema.parse(req.params.deviceId);

  const existing = await prisma.deviceAccess.findUnique({ where: { deviceId } });
  if (!existing) {
    throw new AppError(404, 'Device access not found');
  }

  await prisma.deviceAccess.delete({ where: { deviceId } });
  res.status(204).send();
}));
