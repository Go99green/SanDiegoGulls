import { getDashboardData } from "@/lib/dashboardData";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getDashboardData(), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
