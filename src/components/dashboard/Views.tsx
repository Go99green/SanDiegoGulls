'use client';
import { Bar, BarChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardData } from '@/types/dashboard';
import { KpiCard } from './Cards';
import { goalAttainment, topEvents } from '@/lib/transform';
import { num, pct, usd } from '@/lib/format';

export function OverviewView({ data }: { data: DashboardData }) {
  return <div className="space-y-6">
    <header><h2 className="text-3xl font-bold text-white">Sales Overview</h2><p className="text-slate-400">Executive KPI snapshot and product-performance signals.</p></header>
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data.kpis.map((k)=> <KpiCard key={k.id} metric={k} />)}</section>
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="card-glass p-4 xl:col-span-2"><h3 className="mb-2 text-lg font-semibold text-white">Monthly Full Season New (Qty + Revenue)</h3><div className="h-80"><ResponsiveContainer><BarChart data={data.monthlyFullSeasonNew}><CartesianGrid stroke="#2f2f35"/><XAxis dataKey="month" stroke="#94a3b8"/><YAxis yAxisId="qty" stroke="#94a3b8"/><YAxis yAxisId="rev" orientation="right" stroke="#94a3b8" tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`}/><Tooltip/><Bar yAxisId="qty" dataKey="quantity" fill="#FC4C02" radius={[6,6,0,0]}/><Line yAxisId="rev" dataKey="revenue" stroke="#0088CE" strokeWidth={3} dot={false}/></BarChart></ResponsiveContainer></div></article>
      <article className="card-glass p-4"><h3 className="text-lg font-semibold text-white">Product Mix</h3><div className="h-72"><ResponsiveContainer><PieChart><Pie data={data.productMix} dataKey="revenue" nameKey="category" outerRadius={86}>{data.productMix.map((_,i)=><Cell key={i} fill={['#FC4C02','#0088CE','#14b8a6','#f59e0b'][i%4]}/> )}</Pie><Tooltip formatter={(v)=>usd(Number(v))}/></PieChart></ResponsiveContainer></div></article>
    </section>
  </div>;
}

export function PacingView({ data }: { data: DashboardData }) {
  const events = topEvents(data, 10);
  return <div className="space-y-6"><h2 className="text-3xl font-bold text-white">Pacing & Leaderboards</h2>
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="card-glass p-4"><h3 className="font-semibold text-white">Current vs Prior Pacing</h3>{data.pacing.map((p)=>{const ratio=Math.min((p.current/Math.max(p.prior,1))*100,180); const delta=p.current-p.prior; return <div key={p.label} className="mt-4"><p className="text-sm text-slate-300">{p.label} <span className={delta>=0?'text-emerald-300':'text-rose-300'}>{delta>=0?'+':''}{p.type==='revenue'?usd(delta):num(delta)}</span></p><div className="mt-1 h-2 rounded bg-zinc-800"><div className="h-2 rounded bg-gulls-orange" style={{width:`${Math.min(ratio,100)}%`}}/></div></div>;})}</article>
      <article className="card-glass p-4"><h3 className="font-semibold text-white">Top Games by Revenue</h3>{events.map((e,idx)=><div key={e.event} className="mt-3 flex items-center justify-between border-b border-white/5 pb-2"><p className="text-sm text-slate-200">#{idx+1} {e.event}</p><p className="text-sm text-slate-300">{usd(e.revenue)} · {num(e.tickets)} tix</p></div>)}</article>
    </section>
  </div>;
}

export function AdminView({ data }: { data: DashboardData }) {
  return <div className="space-y-6"><h2 className="text-3xl font-bold text-white">Data Quality / Admin</h2>
    <section className="grid gap-4 xl:grid-cols-2"><article className="card-glass p-4"><h3 className="font-semibold text-white">Goal Tracker</h3>{data.goals.map((g)=>{const a=goalAttainment(g.actual,g.target); return <div key={g.metric} className="mt-3"><div className="mb-1 flex justify-between text-sm"><span>{g.metric}</span><span>{pct(a)}</span></div><div className="h-2 rounded bg-zinc-800"><div className="h-2 rounded bg-gulls-blue" style={{width:`${Math.min(a*100,100)}%`}}/></div></div>;})}</article>
    <article className="card-glass p-4"><h3 className="font-semibold text-white">Trust Panel</h3>{data.health.map((h)=><div key={h.label} className="mt-3 flex justify-between text-sm"><span>{h.label}</span><span className={h.status==='good'?'text-emerald-300':h.status==='warning'?'text-amber-300':'text-rose-300'}>{h.status.toUpperCase()}</span></div>)}</article></section>
  </div>;
}
