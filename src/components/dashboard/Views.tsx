'use client';
import { Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardData } from '@/types/dashboard';
import { KpiCard } from './Cards';
import { usd, num, pct } from '@/lib/format';
import { topEvents, goalAttainment } from '@/lib/transform';

export function OverviewView({data}:{data:DashboardData}){return <div className="space-y-6">
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data.kpis.map(m=><KpiCard key={m.id} m={m}/>)}</section>
  <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 h-80"><h3 className="mb-3 font-semibold">Monthly Full Season New</h3><ResponsiveContainer><BarChart data={data.monthlyFullSeasonNew}><CartesianGrid stroke="#27272a"/><XAxis dataKey="month"/><YAxis yAxisId="q"/><YAxis yAxisId="r" orientation="right"/><Tooltip/><Bar yAxisId="q" dataKey="quantity" fill="#FC4C02"/><Line yAxisId="r" dataKey="revenue" stroke="#0088CE"/></BarChart></ResponsiveContainer></section>
</div>;}

export function PacingView({data}:{data:DashboardData}){const events=topEvents(data);
return <div className="grid gap-6 xl:grid-cols-2">
<section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><h3 className="font-semibold">Pacing Comparison</h3>{data.pacing.map(p=>{const delta=p.current-p.prior; return <div key={p.label} className="mt-4"><p className="text-sm text-slate-300">{p.label}: {num(p.current)} vs {num(p.prior)} <span className={delta>=0?'text-emerald-400':'text-rose-400'}>{delta>=0?'+':''}{num(delta)}</span></p></div>;})}</section>
<section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><h3 className="font-semibold">Top Games by Revenue</h3>{events.map((e,i)=><div key={e.event} className="mt-3"><p>{i+1}. {e.event} — {usd(e.revenue)} / {num(e.tickets)} tickets</p></div>)}</section>
</div>;}

export function AdminView({data}:{data:DashboardData}){return <div className="space-y-6">
<section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><h3 className="font-semibold">Goal Tracker</h3>{data.goals.map(g=>{const a=goalAttainment(g.actual,g.target);return <div key={g.metric} className="mt-3"><p className="text-sm">{g.metric} {pct(a)}</p><div className="h-2 rounded bg-zinc-800"><div style={{width:`${Math.min(a*100,100)}%`}} className="h-2 rounded bg-orange-500"/></div></div>;})}</section>
<section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><h3 className="font-semibold">Data Health Monitor</h3>{data.health.map(h=><p key={h.label} className="mt-2 text-sm">{h.label}: <span className={h.status==='good'?'text-emerald-400':h.status==='warning'?'text-amber-400':'text-rose-400'}>{h.status.toUpperCase()}</span> — {h.detail}</p>)}</section>
</div>;}
