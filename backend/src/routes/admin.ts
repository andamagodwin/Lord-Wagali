import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../lib/http';
import { requireAdminKey } from '../middleware/admin';
import { defaultAccessIds, seedMatches } from '../data/seed';

export const adminRouter = Router();

adminRouter.post('/reset', requireAdminKey, asyncHandler(async (_req, res) => {
  await prisma.$transaction([
    prisma.match.deleteMany(),
    prisma.deviceAccess.deleteMany(),
    prisma.match.createMany({ data: seedMatches, skipDuplicates: true }),
    prisma.deviceAccess.createMany({
      data: defaultAccessIds.map(deviceId => ({ deviceId, isVip: true })),
      skipDuplicates: true,
    }),
  ]);

  res.json({ ok: true });
}));