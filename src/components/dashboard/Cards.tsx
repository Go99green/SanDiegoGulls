import { kpiDelta } from '@/lib/transform';
import { usd,pct,num } from '@/lib/format';
import { KpiMetric } from '@/types/dashboard';

const fmt = (v:number,t:KpiMetric['format'])=> t==='currency'?usd(v):t==='percent'?pct(v):num(v);

export function KpiCard({m}:{m:KpiMetric}){
  const d=kpiDelta(m.value,m.priorValue); const good = d===null?undefined:(m.inverseGood?d<0:d>0);
  return <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-cyan-700">
    <p className="text-xs text-slate-400">{m.label}</p><p className="mt-2 text-3xl font-semibold">{fmt(m.value,m.format)}</p>
    {d!==null && <p className={`mt-2 text-sm ${good?'text-emerald-400':'text-rose-400'}`}>{d>0?'↑':'↓'} {pct(Math.abs(d))} vs prior</p>}
    {m.description && <p className="mt-1 text-xs text-slate-500">{m.description}</p>}
  </article>
}
