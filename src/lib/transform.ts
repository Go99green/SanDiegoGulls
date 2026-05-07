import { DashboardData } from '@/types/dashboard';

export const topEvents = (data: DashboardData, limit = 8) =>
  [...data.eventLeaderboard].sort((a,b)=>b.revenue-a.revenue || b.tickets-a.tickets).slice(0,limit);

export const kpiDelta = (value: number, prior?: number) => {
  if (!prior || prior === 0) return null;
  return (value - prior) / prior;
};

export const goalAttainment = (actual: number, target: number) => (target === 0 ? 0 : actual / target);
