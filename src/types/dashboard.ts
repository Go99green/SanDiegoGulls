export type NavSection = 'overview' | 'pacing' | 'admin';

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  priorValue?: number;
  format: 'currency' | 'number' | 'percent';
  inverseGood?: boolean;
  description?: string;
}

export interface MonthlyPoint { month: string; quantity: number; revenue: number; }
export interface LeaderboardEntry { name: string; value: number; revenue?: number; }
export interface PacingPoint { label: string; current: number; prior: number; type: 'tickets' | 'revenue'; }
export interface HealthCheck { label: string; status: 'good'|'warning'|'error'; detail: string; }
export interface AuditNote { legacyFormula: string; legacyValue: string; cleanValue: string; reason: string; usingClean: boolean; }

export interface DashboardData {
  kpis: KpiMetric[];
  monthlyFullSeasonNew: MonthlyPoint[];
  productMix: { category: string; revenue: number }[];
  paymentStatus: { label: string; amount: number }[];
  groupLeaderboard: LeaderboardEntry[];
  fseLeaderboard: LeaderboardEntry[];
  miniPlans: LeaderboardEntry[];
  eventLeaderboard: Array<{event: string; tickets: number; revenue: number}>;
  pacing: PacingPoint[];
  goals: Array<{metric: string; actual: number; target: number; format:'currency'|'number'|'percent'}>;
  health: HealthCheck[];
  legacyNotes: AuditNote[];
  lastUpdated: string;
}
