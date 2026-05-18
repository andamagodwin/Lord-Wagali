import { Router } from 'express';
import { prisma } from '../prisma';
import { asyncHandler } from '../lib/http';
import { requireAdminKey } from '../middleware/admin';

export const configRouter = Router();

configRouter.get('/', asyncHandler(async (_req, res) => {
  const configs = await prisma.appConfig.findMany();
  const map: Record<string, string> = {};
  for (const c of configs) {
    map[c.key] = c.value;
  }

  res.json({
    downloadUrl: map['download_url'] || '',
    latestVersion: map['latest_version'] || '1.0.0',
  });
}));

configRouter.put('/', requireAdminKey, asyncHandler(async (req, res) => {
  const { downloadUrl, latestVersion } = req.body;

  if (downloadUrl !== undefined) {
    await prisma.appConfig.upsert({
      where: { key: 'download_url' },
      update: { value: downloadUrl },
      create: { key: 'download_url', value: downloadUrl },
    });
  }

  if (latestVersion !== undefined) {
    await prisma.appConfig.upsert({
      where: { key: 'latest_version' },
      update: { value: latestVersion },
      create: { key: 'latest_version', value: latestVersion },
    });
  }

  res.json({ ok: true });
}));
