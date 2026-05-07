'use client';
import { NavSection } from '@/types/dashboard';

export function AppShell({ section, onSectionChange, children }: { section: NavSection; onSectionChange: (s: NavSection)=>void; children: React.ReactNode }) {
  const items: Array<{id:NavSection;label:string}> = [
    {id:'overview',label:'Sales Overview'}, {id:'pacing',label:'Pacing & Leaderboards'}, {id:'admin',label:'Data Quality / Admin'}
  ];
  return <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
    <aside className="border-r border-zinc-800 bg-zinc-950/90 p-4">
      <h1 className="text-lg font-semibold">Gulls Command Center</h1>
      <nav className="mt-6 space-y-2">{items.map(i=><button key={i.id} onClick={()=>onSectionChange(i.id)} className={`w-full rounded-lg px-3 py-2 text-left ${section===i.id?'bg-cyan-900/40 text-cyan-200':'text-slate-300 hover:bg-zinc-800'}`}>{i.label}</button>)}</nav>
    </aside>
    <main className="p-4 md:p-8">{children}</main>
  </div>;
}
