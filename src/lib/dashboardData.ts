import rawData from "@/data/gulls-dashboard-export.json";
import { safeNumber } from "./formatters";

export type DashboardTables = Record<string, any[]>;
export type DashboardData = {
  metadata: Record<string, any>;
  tables: DashboardTables;
};

const data = rawData as DashboardData;

export function getDashboardData(): DashboardData {
  return data;
}

export function table(name: string) {
  return data.tables?.[name] ?? [];
}

export function overviewValue(metric: string) {
  const row = table("overview").find((item) => item.Metric === metric);
  return safeNumber(row?.Value);
}

export function sortedBy(rows: any[], key: string, limit?: number) {
  const sorted = [...rows].sort((a, b) => safeNumber(b[key]) - safeNumber(a[key]));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
