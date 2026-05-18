import type { Match } from '@prisma/client';
import type { MatchResponse } from '../types';

export function toMatchResponse(match: Match): MatchResponse {
  return {
    id: match.id,
    home: match.home,
    away: match.away,
    homeLogo: match.homeLogo,
    awayLogo: match.awayLogo,
    tip: match.tip,
    odds: match.odds,
    prob: match.prob,
    league: match.league,
    time: match.time,
    summary: match.summary,
    winProb: match.winProb as MatchResponse['winProb'],
    stats: match.stats as MatchResponse['stats'],
    form: match.form as MatchResponse['form'],
    h2h: match.h2h as MatchResponse['h2h'],
    segment: match.segment,
    status: match.status,
    settledAt: match.settledAt?.toISOString() ?? null,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
  };
}
