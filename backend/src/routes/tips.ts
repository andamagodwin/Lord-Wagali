import { Router } from 'express';
import { z } from 'zod';
import { Prisma, TipSegment, TipStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { asyncHandler, AppError } from '../lib/http';
import { requireAdminKey } from '../middleware/admin';
import { toMatchResponse } from '../lib/mappers';

export const tipsRouter = Router();

const matchPayloadSchema = z.object({
  id: z.string().min(1).max(64).optional(),
  home: z.string().trim().min(1),
  away: z.string().trim().min(1),
  homeLogo: z.string().trim().min(1).default('0'),
  awayLogo: z.string().trim().min(1).default('0'),
  tip: z.string().trim().min(1),
  odds: z.string().trim().min(1),
  prob: z.string().trim().min(1),
  league: z.string().trim().min(1),
  time: z.string().trim().min(1),
  summary: z.string().trim().optional().nullable(),
  winProb: z.record(z.unknown()).optional().nullable(),
  stats: z.array(z.unknown()).optional().nullable(),
  form: z.record(z.unknown()).optional().nullable(),
  h2h: z.array(z.unknown()).optional().nullable(),
});

const tipSegmentParam = z.enum(['free', 'vip']);
const tipIdParam = z.string().trim().min(1).max(64);
const settleSchema = z.object({
  status: z.enum(['won', 'lost']),
});

function segmentToPrisma(segment: z.infer<typeof tipSegmentParam>): TipSegment {
  return segment === 'free' ? TipSegment.FREE : TipSegment.VIP;
}

function statusToPrisma(status: z.infer<typeof settleSchema>['status']): TipStatus {
  return status === 'won' ? TipStatus.WON : TipStatus.LOST;
}

function jsonValue(value: unknown) {
  return value as Prisma.InputJsonValue;
}

async function listActive(segment: TipSegment) {
  const items = await prisma.match.findMany({
    where: { segment, status: TipStatus.ACTIVE },
    orderBy: { createdAt: 'desc' },
  });

  return items.map(toMatchResponse);
}

tipsRouter.get('/free', asyncHandler(async (_req, res) => {
  res.json(await listActive(TipSegment.FREE));
}));

tipsRouter.get('/vip', asyncHandler(async (_req, res) => {
  res.json(await listActive(TipSegment.VIP));
}));

tipsRouter.get('/history', asyncHandler(async (_req, res) => {
  const items = await prisma.match.findMany({
    where: { status: { not: TipStatus.ACTIVE } },
    orderBy: { settledAt: 'desc' },
  });

  res.json(items.map(item => ({
    ...toMatchResponse(item),
    date: item.settledAt ? item.settledAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
  })));
}));

tipsRouter.get('/:id', asyncHandler(async (req, res) => {
  const id = tipIdParam.parse(req.params.id);
  const item = await prisma.match.findUnique({ where: { id } });
  if (!item) {
    throw new AppError(404, 'Tip not found');
  }

  res.json(toMatchResponse(item));
}));

tipsRouter.post('/', requireAdminKey, asyncHandler(async (req, res) => {
  const body = z.object({
    segment: tipSegmentParam,
    tip: matchPayloadSchema,
  }).parse(req.body);

  const created = await prisma.match.create({
    data: {
      id: body.tip.id ?? (body.segment === 'free' ? `free-${Date.now()}` : `vip-${Date.now()}`),
      segment: segmentToPrisma(body.segment),
      home: body.tip.home,
      away: body.tip.away,
      homeLogo: body.tip.homeLogo,
      awayLogo: body.tip.awayLogo,
      tip: body.tip.tip,
      odds: body.tip.odds,
      prob: body.tip.prob,
      league: body.tip.league,
      time: body.tip.time,
      summary: body.tip.summary ?? null,
      ...(body.tip.winProb !== undefined ? { winProb: jsonValue(body.tip.winProb) } : {}),
      ...(body.tip.stats !== undefined ? { stats: jsonValue(body.tip.stats) } : {}),
      ...(body.tip.form !== undefined ? { form: jsonValue(body.tip.form) } : {}),
      ...(body.tip.h2h !== undefined ? { h2h: jsonValue(body.tip.h2h) } : {}),
      status: TipStatus.ACTIVE,
    },
  });

  res.status(201).json(toMatchResponse(created));
}));

tipsRouter.patch('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  const body = matchPayloadSchema.partial().parse(req.body);
  const id = tipIdParam.parse(req.params.id);
  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Tip not found');
  }

  const updated = await prisma.match.update({
    where: { id },
    data: {
      ...(body.home ? { home: body.home } : {}),
      ...(body.away ? { away: body.away } : {}),
      ...(body.homeLogo ? { homeLogo: body.homeLogo } : {}),
      ...(body.awayLogo ? { awayLogo: body.awayLogo } : {}),
      ...(body.tip ? { tip: body.tip } : {}),
      ...(body.odds ? { odds: body.odds } : {}),
      ...(body.prob ? { prob: body.prob } : {}),
      ...(body.league ? { league: body.league } : {}),
      ...(body.time ? { time: body.time } : {}),
      ...(body.summary !== undefined ? { summary: body.summary } : {}),
      ...(body.winProb !== undefined ? { winProb: jsonValue(body.winProb) } : {}),
      ...(body.stats !== undefined ? { stats: jsonValue(body.stats) } : {}),
      ...(body.form !== undefined ? { form: jsonValue(body.form) } : {}),
      ...(body.h2h !== undefined ? { h2h: jsonValue(body.h2h) } : {}),
    },
  });

  res.json(toMatchResponse(updated));
}));

tipsRouter.delete('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  const id = tipIdParam.parse(req.params.id);
  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Tip not found');
  }

  await prisma.match.delete({ where: { id } });
  res.status(204).send();
}));

tipsRouter.post('/:id/settle', requireAdminKey, asyncHandler(async (req, res) => {
  const body = settleSchema.parse(req.body);
  const id = tipIdParam.parse(req.params.id);
  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Tip not found');
  }

  const settled = await prisma.match.update({
    where: { id },
    data: {
      status: statusToPrisma(body.status),
      settledAt: new Date(),
    },
  });

  res.json(toMatchResponse(settled));
}));
