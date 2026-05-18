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
  const body = z.object({
    deviceId: deviceIdSchema,
    requestingDeviceId: deviceIdSchema.optional(),
  }).parse(req.body);

  const codeToActivate = body.deviceId;
  const requestingDevice = body.requestingDeviceId;

  // If a requesting device ID is provided, only allow activation if it matches the code
  // This prevents sharing: you can only activate your own device ID
  if (requestingDevice && requestingDevice !== codeToActivate) {
    // Check if this code is authorized by admin
    const authorized = await prisma.deviceAccess.findUnique({
      where: { deviceId: codeToActivate },
    });
    if (!authorized || !authorized.isVip) {
      throw new AppError(403, 'This activation code does not belong to your device.');
    }
    // Code is valid but belongs to a different device — reject
    throw new AppError(403, 'This activation code is bound to another device.');
  }

  // Check if this device has been authorized by admin
  const existing = await prisma.deviceAccess.findUnique({
    where: { deviceId: codeToActivate },
  });

  if (!existing || !existing.isVip) {
    throw new AppError(403, 'Device not authorized. Contact admin after payment.');
  }

  res.status(200).json({
    deviceId: existing.deviceId,
    isVip: existing.isVip,
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
