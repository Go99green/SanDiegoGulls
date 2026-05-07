'use client';
import { NavSection } from '@/types/dashboard';

const items: Array<{ id: NavSection; label: string; hint: string }> = [
  { id: 'overview', label: 'Sales Overview', hint: 'KPIs, product mix, monthly performance' },
  { id: 'pacing', label: 'Pacing & Leaderboards', hint: 'Reps, pacing, top games' },
  { id: 'admin', label: 'Data Quality / Admin', hint: 'Trust panel, goals, audit notes' }
];

export function AppShell({ section, onSectionChange, children }: { section: NavSection; onSectionChange: (s: NavSection) => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-gulls-silver">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 p-5">
          <h1 className="text-xl font-bold text-white">Gulls Ticketing Command Center</h1>
          <p className="mt-1 text-xs text-slate-400">Holt Analytics / Internal</p>
          <nav className="mt-6 space-y-3">
            {items.map((item) => (
              <button key={item.id} onClick={() => onSectionChange(item.id)} className={`w-full rounded-lg border px-3 py-2 text-left transition ${section === item.id ? 'border-gulls-blue bg-gulls-blue/20 text-white' : 'border-white/10 bg-zinc-900/60 text-slate-300 hover:border-gulls-orange/60 hover:text-white'}`}>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-slate-400">{item.hint}</div>
              </button>
            ))}
          </nav>
        </aside>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
