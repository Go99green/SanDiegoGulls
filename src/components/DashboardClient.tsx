"use client";

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currency, decimal, formatByType, integer, percent, safeNumber } from "@/lib/formatters";
import type { DashboardData } from "@/lib/dashboardData";

type TabKey = "overview" | "pacing" | "quality";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CHART_COLORS = ["#FC4C02", "#0088CE", "#2DD4FF", "#BFCED6", "#7C3AED", "#22C55E", "#F59E0B"];

function getOverview(tables: Record<string, any[]>, metric: string) {
  return safeNumber((tables.overview ?? []).find((row) => row.Metric === metric)?.Value);
}

function sum(rows: any[], key: string) {
  return rows.reduce((acc, row) => acc + safeNumber(row[key]), 0);
}

function sortRows(rows: any[], key: string, limit?: number) {
  const sorted = [...rows].sort((a, b) => safeNumber(b[key]) - safeNumber(a[key]));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

function rankSuffix(rank: number) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [active, setActive] = useState<TabKey>("overview");
  const tables = data.tables ?? {};

  const model = useMemo(() => buildModel(tables), [tables]);

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto grid max-w-[1760px] grid-cols-1 gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <Sidebar active={active} setActive={setActive} />

        <section className="min-w-0 space-y-6">
          <Header metadata={data.metadata} />
          <MobileTabs active={active} setActive={setActive} />

          {active === "overview" && <SalesOverview model={model} />}
          {active === "pacing" && <PacingLeaderboards model={model} />}
          {active === "quality" && <QualityAdmin model={model} metadata={data.metadata} />}
        </section>
      </div>
    </main>
  );
}

function buildModel(tables: Record<string, any[]>) {
  const currentVisibleRevenue =
    getOverview(tables, "Current Season Ticket-Line Revenue") + getOverview(tables, "Current Season Package Revenue");
  const ticketQuantity = getOverview(tables, "Current Season Ticket Quantity");
  const packageSeats = getOverview(tables, "Current Season Package Seats");
  const outstanding = getOverview(tables, "Outstanding Balance");
  const avgRenewal = getOverview(tables, "Average Renewal Rate");
  const bestGameRevenue = getOverview(tables, "Best Game Revenue");

  const pacingRows = tables.salesPacing ?? [];
  const currentPacingRevenue = sum(pacingRows, "Current Revenue");
  const priorPacingRevenue = sum(pacingRows, "Prior Revenue");
  const currentPacingTickets = sum(pacingRows, "Current Tickets");
  const priorPacingTickets = sum(pacingRows, "Prior Tickets");
  const revenueDelta = priorPacingRevenue ? (currentPacingRevenue - priorPacingRevenue) / priorPacingRevenue : 0;
  const ticketDelta = priorPacingTickets ? (currentPacingTickets - priorPacingTickets) / priorPacingTickets : 0;

  const monthly = MONTHS.map((month) => ({
    month: month.slice(0, 3),
    fse: sum(tables.salesMonthlyFullSeasonNew ?? [], `${month} FSE`),
    revenue: sum(tables.salesMonthlyFullSeasonNew ?? [], `${month} Revenue`),
  })).filter((row) => row.fse || row.revenue);

  const productSummary = sortRows(tables.productSummary ?? [], "Revenue");
  const paymentStatus = tables.paymentStatus ?? [];
  const eventLeaderboard = sortRows(tables.eventLeaderboard ?? [], "Revenue", 10);
  const groupLeaders = sortRows(tables.salesGroupSales ?? [], "Total Revenue", 8);
  const fseLeaders = sortRows(tables.salesFullSeasonRenewal ?? [], "Total Full Season Revenue", 8);
  const miniLeaders = sortRows(tables.salesMiniPlans ?? [], "Total Mini Plan Revenue", 8);
  const addOnLeaders = sortRows(tables.salesAddOnPlans ?? [], "Flex Revenue", 8);
  const goalTracker = tables.salesGoalTracker ?? [];
  const dataQuality = tables.salesDataQuality ?? [];
  const legacyNotes = tables.legacyCorrectionNotes ?? [];
  const topProduct = productSummary[0];
  const topRep = groupLeaders[0];
  const topGame = eventLeaderboard[0];

  return {
    currentVisibleRevenue,
    ticketQuantity,
    packageSeats,
    outstanding,
    avgRenewal,
    bestGameRevenue,
    revenueDelta,
    ticketDelta,
    monthly,
    productSummary,
    paymentStatus,
    eventLeaderboard,
    groupLeaders,
    fseLeaders,
    miniLeaders,
    addOnLeaders,
    pacingRows,
    goalTracker,
    dataQuality,
    legacyNotes,
    topProduct,
    topRep,
    topGame,
  };
}

function Sidebar({ active, setActive }: { active: TabKey; setActive: (tab: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; kicker: string; detail: string }[] = [
    { key: "overview", label: "Sales Overview", kicker: "Command", detail: "Revenue, product mix, trend" },
    { key: "pacing", label: "Pacing & Leaderboards", kicker: "Momentum", detail: "Reps, games, current vs prior" },
    { key: "quality", label: "Data Quality / Admin", kicker: "Trust", detail: "Health, corrections, source data" },
  ];

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-card backdrop-blur-xl lg:block">
      <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-gulls-blue/15 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-gulls-orange/15 blur-3xl" />
      <div className="relative flex h-full flex-col">
        <div>
          <div className="mb-6 h-2 w-24 rounded-full bg-gulls-orange shadow-orangeGlow" />
          <p className="text-xs font-black uppercase tracking-[0.42em] text-gulls-blue">Holt Analytics</p>
          <h1 className="mt-4 text-4xl font-black leading-none tracking-tight">Gulls Command</h1>
          <p className="mt-4 text-sm leading-6 text-gulls-silver/75">
            Executive ticketing intelligence built from the cleaned DASH_EXPORT workbook tables.
          </p>
        </div>

        <nav className="mt-8 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                active === tab.key
                  ? "border-gulls-orange/50 bg-gulls-orange/10 shadow-orangeGlow"
                  : "border-white/10 bg-white/[0.035] hover:border-gulls-blue/45 hover:bg-gulls-blue/10"
              }`}
            >
              <p className="mini-label">{tab.kicker}</p>
              <p className="mt-1 text-base font-black text-white">{tab.label}</p>
              <p className="mt-1 text-xs text-white/45">{tab.detail}</p>
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-gulls-silver">Source Mode</p>
          <p className="mt-2 text-sm font-black text-white">Static JSON</p>
          <p className="mt-1 text-xs leading-5 text-white/45">Ready to swap to SharePoint / OneDrive adapter later.</p>
        </div>
      </div>
    </aside>
  );
}

function Header({ metadata }: { metadata: Record<string, any> }) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#24120D]/95 via-[#11151A]/95 to-[#061321]/95 p-6 shadow-card backdrop-blur-xl lg:p-8">
      <div className="absolute right-0 top-0 h-40 w-72 rounded-full bg-gulls-blue/15 blur-3xl" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mini-label">San Diego Gulls · Internal Analytics</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Ticketing Command Center</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-gulls-silver/80">
            Premium command view of sales, pacing, revenue, package performance, and data trust. Designed to communicate the story faster than Excel while preserving workbook parity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action="/api/logout" method="POST">
            <button className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-white/70 transition hover:border-gulls-orange/60 hover:text-white">
              Log Out
            </button>
          </form>
          <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Exported</p>
            <p className="text-xs font-bold text-gulls-silver">{metadata?.generatedAt ? new Date(metadata.generatedAt).toLocaleString() : "Static source"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileTabs({ active, setActive }: { active: TabKey; setActive: (tab: TabKey) => void }) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Sales Overview" },
    { key: "pacing", label: "Pacing" },
    { key: "quality", label: "Data Quality" },
  ];
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-2 lg:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black ${active === tab.key ? "bg-gulls-orange text-black" : "bg-white/5 text-white/70"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function SalesOverview({ model }: { model: ReturnType<typeof buildModel> }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Visible Revenue" value={currency(model.currentVisibleRevenue)} detail="Ticket-line revenue + package/order revenue" delta={model.revenueDelta} accent="orange" />
        <KpiCard title="Ticket Quantity" value={integer(model.ticketQuantity)} detail="2025-26 clean ticket-line quantity" delta={model.ticketDelta} accent="blue" />
        <KpiCard title="Package Seats" value={integer(model.packageSeats)} detail="Current season package seats" badge="Clean Export" accent="silver" />
        <KpiCard title="Outstanding Balance" value={currency(model.outstanding)} detail="Amount due across clean orders" badge="Watch" inverse accent="cyan" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <CommandCard kicker="Monthly Trend" title="Full Season New: FSE + Revenue" description="Bars show monthly FSE. The cyan line shows revenue across the same months.">
          <MonthlyTrendChart data={model.monthly} />
        </CommandCard>

        <CommandCard kicker="Executive Brief" title="What matters now" description="A leadership-friendly readout built from the cleaned export tables.">
          <div className="grid gap-4">
            <InsightCard label="Top revenue category" value={model.topProduct?.["Product Category"] ?? "—"} detail={currency(model.topProduct?.Revenue)} accent="bg-gulls-orange" />
            <InsightCard label="Best group sales rep" value={model.topRep?.Rep ?? "—"} detail={currency(model.topRep?.["Total Revenue"])} accent="bg-gulls-blue" />
            <InsightCard label="Best game revenue" value={model.topGame?.Event ?? "—"} detail={currency(model.topGame?.Revenue)} accent="bg-gulls-cyan" />
            <InsightCard label="Average renewal rate" value={percent(model.avgRenewal)} detail="Clean renewal-rate export" accent="bg-emerald-400" />
          </div>
        </CommandCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <CommandCard kicker="Revenue Composition" title="Product Mix" description="Ranked revenue mix by product category.">
          <ProductMix items={model.productSummary} />
        </CommandCard>
        <CommandCard kicker="Cash Visibility" title="Payment Status" description="Order total, paid amount, and open balance by payment status.">
          <PaymentStatus rows={model.paymentStatus} />
        </CommandCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CommandCard kicker="Rep Spotlight" title="Group Sales Leaderboard" description="Gamified leaderboard with proportional revenue bars.">
          <Leaderboard rows={model.groupLeaders} valueKey="Total Revenue" labelKey="Rep" />
        </CommandCard>
        <CommandCard kicker="Full Season" title="New + Renewal Leaders" description="Full season revenue by rep, including new and renewed sales.">
          <Leaderboard rows={model.fseLeaders} valueKey="Total Full Season Revenue" labelKey="Rep" />
        </CommandCard>
      </section>
    </div>
  );
}

function PacingLeaderboards({ model }: { model: ReturnType<typeof buildModel> }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <CommandCard kicker="Current vs Prior" title="Pacing Comparison" description="Orange is current season. Blue is prior season. Variance is shown directly on each segment.">
          <div className="space-y-5">
            {model.pacingRows.map((row) => <PacingCard key={row.Segment} row={row} />)}
          </div>
        </CommandCard>
        <CommandCard kicker="Game Summary" title="Top Games by Revenue" description="Ranked directly from event records to avoid duplicate lookup issues.">
          <EventLeaderboard rows={model.eventLeaderboard} />
        </CommandCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CommandCard kicker="Partial Plans" title="Mini Plan Leaders" description="Total mini-plan revenue by rep across 6-game, 12-game, and concert series products.">
          <Leaderboard rows={model.miniLeaders} valueKey="Total Mini Plan Revenue" labelKey="Rep" />
        </CommandCard>
        <CommandCard kicker="Flex / Holiday / Deposits" title="Add-On Plan Leaders" description="Flex revenue leader view with holiday/deposit detail preserved in data.">
          <Leaderboard rows={model.addOnLeaders} valueKey="Flex Revenue" labelKey="Rep" />
        </CommandCard>
      </section>

      <CommandCard kicker="Legacy Calculator, Cleaned" title="Goal Tracker" description="Key metrics from the legacy calculator, formatted correctly by type.">
        <GoalTracker rows={model.goalTracker} />
      </CommandCard>
    </div>
  );
}

function QualityAdmin({ model, metadata }: { model: ReturnType<typeof buildModel>; metadata: Record<string, any> }) {
  return (
    <div className="space-y-6">
      <CommandCard kicker="Trust Panel" title="Data Health Status" description="Health widgets replace pass/fail spreadsheet rows with visible confidence signals.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {model.dataQuality.map((row) => <HealthWidget key={row.Check} row={row} />)}
        </div>
      </CommandCard>

      <CommandCard kicker="Accuracy Audit" title="Legacy Correction Notes" description="Important corrections that make the dashboard more accurate than the legacy worksheet.">
        <div className="grid gap-4">
          {model.legacyNotes.map((row) => <CorrectionNote key={row["Legacy Area"]} row={row} />)}
        </div>
      </CommandCard>

      <CommandCard kicker="Source" title="Workbook Export Metadata" description="Current static source. Future live SharePoint / OneDrive connection can preserve this shape.">
        <div className="grid gap-4 md:grid-cols-3">
          <MetaCard label="Source workbook" value={metadata?.sourceWorkbook ?? "—"} />
          <MetaCard label="Export generated" value={metadata?.generatedAt ? new Date(metadata.generatedAt).toLocaleString() : "—"} />
          <MetaCard label="Export tables" value={integer((metadata?.exportTables ?? []).length)} />
        </div>
      </CommandCard>
    </div>
  );
}

function KpiCard({ title, value, detail, delta, badge, inverse, accent }: { title: string; value: string; detail: string; delta?: number; badge?: string; inverse?: boolean; accent: "orange" | "blue" | "silver" | "cyan" }) {
  const accentMap = {
    orange: "bg-gulls-orange shadow-orangeGlow",
    blue: "bg-gulls-blue shadow-blueGlow",
    silver: "bg-gulls-silver",
    cyan: "bg-gulls-cyan shadow-blueGlow",
  };
  const hasDelta = typeof delta === "number";
  const positive = safeNumber(delta) >= 0;
  const good = inverse ? !positive : positive;
  return (
    <article className="command-card glass-hover p-5">
      <div className={`mb-4 h-1.5 w-16 rounded-full ${accentMap[accent]}`} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gulls-silver/80">{title}</p>
        {hasDelta ? (
          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${good ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20" : "bg-red-400/10 text-red-300 ring-1 ring-red-300/20"}`}>
            {positive ? "↑" : "↓"} {percent(Math.abs(safeNumber(delta)))}
          </span>
        ) : (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-white/60">{badge}</span>
        )}
      </div>
      <p className="mt-4 text-4xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-5 text-white/50">{detail}</p>
    </article>
  );
}

function CommandCard({ kicker, title, description, children }: { kicker: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="command-card p-5 lg:p-6">
      <div className="mb-5">
        <p className="mini-label">{kicker}</p>
        <h3 className="mt-1 text-2xl font-black tracking-tight text-white">{title}</h3>
        {description && <p className="mt-2 muted-copy">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function MonthlyTrendChart({ data }: { data: { month: string; fse: number; revenue: number }[] }) {
  return (
    <div className="h-[390px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 18, right: 12, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="orangeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FC4C02" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#FC4C02" stopOpacity={0.30} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => decimal(value, 0)} />
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(value) => currency(value, true)} />
          <Tooltip content={<ChartTooltip />} />
          <Bar yAxisId="left" dataKey="fse" name="FSE" fill="url(#orangeBar)" radius={[10, 10, 2, 2]} barSize={42} />
          <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#2DD4FF" strokeWidth={4} dot={{ r: 5, fill: "#2DD4FF", strokeWidth: 0 }} activeDot={{ r: 8 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/15 bg-[#07090C]/95 p-4 shadow-card backdrop-blur-xl">
      <p className="mb-2 text-xs font-black uppercase tracking-widest text-gulls-silver">{label}</p>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex min-w-44 items-center justify-between gap-4 text-sm">
          <span style={{ color: item.color }} className="font-bold">{item.name}</span>
          <span className="font-black text-white">{item.dataKey === "revenue" ? currency(item.value) : decimal(item.value, 1)}</span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">{label}</p>
          <p className="mt-1 text-xl font-black text-white">{value}</p>
        </div>
        <div className={`h-10 w-1.5 rounded-full ${accent}`} />
      </div>
      <p className="mt-2 text-sm font-bold text-gulls-silver/70">{detail}</p>
    </div>
  );
}

function ProductMix({ items }: { items: any[] }) {
  const max = Math.max(...items.map((row) => safeNumber(row.Revenue)), 1);
  return (
    <div className="space-y-4">
      {items.slice(0, 8).map((row) => {
        const width = (safeNumber(row.Revenue) / max) * 100;
        return (
          <div key={row["Product Category"]}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-white">{row["Product Category"]}</p>
              <p className="text-sm font-black text-gulls-silver">{currency(row.Revenue)}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-gulls-orange via-[#B86B56] to-gulls-blue" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentStatus({ rows }: { rows: any[] }) {
  const total = sum(rows, "Order Total");
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={rows} dataKey="Order Total" nameKey="Payment Status" innerRadius={62} outerRadius={92} paddingAngle={4}>
              {rows.map((_, index) => <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value: number) => currency(value)} contentStyle={{ background: "#07090C", border: "1px solid rgba(255,255,255,.14)", borderRadius: "16px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={row["Payment Status"]} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <p className="font-black text-white">{row["Payment Status"]}</p>
              </div>
              <p className="font-black text-gulls-silver">{currency(row["Order Total"])}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gulls-blue" style={{ width: `${total ? (safeNumber(row["Order Total"]) / total) * 100 : 0}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/45">Open due: {currency(row["Amount Due"])} · {percent(row["Due %"])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard({ rows, valueKey, labelKey }: { rows: any[]; valueKey: string; labelKey: string }) {
  const max = Math.max(...rows.map((row) => safeNumber(row[valueKey])), 1);
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`${row[labelKey]}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-11 items-center justify-center rounded-xl text-xs font-black ${index < 3 ? "bg-gulls-orange text-black" : "bg-white/10 text-white/70"}`}>{rankSuffix(index + 1)}</div>
              <p className="font-black text-white">{row[labelKey] || "Unassigned"}</p>
            </div>
            <p className="font-black text-gulls-silver">{currency(row[valueKey])}</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-gradient-to-r from-gulls-orange to-gulls-cyan" style={{ width: `${(safeNumber(row[valueKey]) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PacingCard({ row }: { row: any }) {
  const current = safeNumber(row["Current Revenue"]);
  const prior = safeNumber(row["Prior Revenue"]);
  const max = Math.max(current, prior, 1);
  const diff = current - prior;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-black text-white">{row.Segment}</p>
          <p className="mt-1 text-sm text-white/45">{integer(row["Current Tickets"])} current tickets vs {integer(row["Prior Tickets"])} prior</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${diff >= 0 ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20" : "bg-red-400/10 text-red-300 ring-1 ring-red-300/20"}`}>{diff >= 0 ? "+" : ""}{currency(diff)} variance</span>
      </div>
      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold text-gulls-blue"><span>Prior</span><span>{currency(prior)}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gulls-blue" style={{ width: `${(prior / max) * 100}%` }} /></div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold text-gulls-orange"><span>Current</span><span>{currency(current)}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gulls-orange" style={{ width: `${(current / max) * 100}%` }} /></div>
        </div>
      </div>
    </div>
  );
}

function EventLeaderboard({ rows }: { rows: any[] }) {
  const max = Math.max(...rows.map((row) => safeNumber(row.Revenue)), 1);
  return (
    <div className="space-y-3">
      {rows.slice(0, 8).map((row) => (
        <div key={`${row.Rank}-${row.Event}-${row["Event Date"]}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gulls-orange">#{row.Rank}</p>
              <p className="font-black text-white">{row.Event}</p>
              <p className="mt-1 text-xs text-white/45">{row["Event Date"]} · {integer(row["Tickets Sold"])} sold · {currency(row["Revenue Per Ticket"])} / ticket</p>
            </div>
            <p className="font-black text-gulls-silver">{currency(row.Revenue)}</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-gradient-to-r from-gulls-orange to-gulls-blue" style={{ width: `${(safeNumber(row.Revenue) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalTracker({ rows }: { rows: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const isPercent = row.Format === "percent";
        const display = formatByType(row["Current Value"], row.Format);
        const progress = isPercent ? Math.max(0, Math.min(100, safeNumber(row["Current Value"]) * 100)) : null;
        return (
          <div key={row.Metric} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">{row.Metric}</p>
            <p className="mt-2 text-2xl font-black text-white">{display}</p>
            {progress !== null && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full bg-gradient-to-r from-gulls-orange to-emerald-300" style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-white/45">{row.Notes}</p>
          </div>
        );
      })}
    </div>
  );
}

function HealthWidget({ row }: { row: any }) {
  const pass = String(row.Status).toUpperCase() === "PASS";
  const value = safeNumber(row.Value);
  const isLoaded = ["Ticket Lines Loaded", "Orders Loaded", "Game Summary Loaded", "Renewal Rate Loaded"].includes(row.Check);
  const score = pass ? 100 : isLoaded && value > 0 ? 70 : 20;
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center gap-4">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,.10)" strokeWidth="10" fill="none" />
          <circle cx="50" cy="50" r="38" stroke={pass ? "#2AF598" : "#FFD166"} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div>
          <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest ${pass ? "bg-emerald-400/10 text-emerald-300" : "bg-yellow-400/10 text-yellow-200"}`}>{row.Status}</span>
          <p className="mt-2 text-lg font-black text-white">{row.Check}</p>
          <p className="mt-1 text-sm font-black text-gulls-silver">{row.Check.includes("Rate") && value <= 1 ? percent(value) : integer(value)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-white/45">{row.Notes}</p>
    </div>
  );
}

function CorrectionNote({ row }: { row: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mini-label">{row["Legacy Area"]}</p>
          <p className="mt-2 text-xl font-black text-white">{row.Decision}</p>
          <p className="mt-2 text-sm leading-6 text-white/55">{row.Notes}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right">
          <div className="rounded-xl bg-red-400/10 p-3 ring-1 ring-red-300/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-200/70">Legacy</p>
            <p className="mt-1 font-black text-red-100">{currency(row["Legacy Cached Value"])}</p>
          </div>
          <div className="rounded-xl bg-emerald-400/10 p-3 ring-1 ring-emerald-300/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/70">Clean</p>
            <p className="mt-1 font-black text-emerald-100">{currency(row["Clean Export Value"])}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">{label}</p>
      <p className="mt-2 break-words text-sm font-black text-white">{value}</p>
    </div>
  );
}
