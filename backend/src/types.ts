export type TipSegment = 'FREE' | 'VIP';
export type TipStatus = 'ACTIVE' | 'WON' | 'LOST';

export interface MatchResponse {
  id: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  tip: string;
  odds: string;
  prob: string;
  league: string;
  time: string;
  summary?: string | null;
  winProb?: Record<string, unknown> | null;
  stats?: unknown[] | null;
  form?: Record<string, unknown> | null;
  h2h?: unknown[] | null;
  segment: TipSegment;
  status: TipStatus;
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
