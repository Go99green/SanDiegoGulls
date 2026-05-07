import { KpiMetric } from '@/types/dashboard';
import { kpiDelta } from '@/lib/transform';
import { compact, num, pct, usd } from '@/lib/format';

const renderValue = (value: number, format: KpiMetric['format']) => {
  if (format === 'currency') return usd(value);
  if (format === 'percent') return pct(value);
  return num(value);
};

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const delta = kpiDelta(metric.value, metric.priorValue);
  const good = delta == null ? null : metric.inverseGood ? delta < 0 : delta > 0;
  return (
    <article className="card-glass p-4 hover:border-gulls-blue/70">
      <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{renderValue(metric.value, metric.format)}</p>
      {delta !== null && (
        <p className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${good ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
          {delta > 0 ? '↑' : '↓'} {pct(Math.abs(delta))} vs prior
        </p>
      )}
      <p className="mt-2 text-sm text-slate-400">{metric.description ?? `Current period ${compact(metric.value)}`}</p>
    </article>
  );
}
