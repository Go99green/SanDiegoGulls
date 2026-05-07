import { getDashboardData } from "@/lib/dashboardData";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const data = getDashboardData();
  return <DashboardClient data={data} />;
}
