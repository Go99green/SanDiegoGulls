# Exact replacement instructions

1. Keep your existing auth gate route handlers and middleware unchanged (passcode + JWT/session logic using `GULLS_DASHBOARD_PASSCODE` and `GULLS_AUTH_SECRET`).
2. Drop these UI files under `src/` and mount them inside your authenticated page route.
3. Replace `mockData` with your static JSON adapter in `src/lib/mock-data.ts` (or rename to `data-adapter.ts`).
4. Preserve table parity by keeping raw tables available in collapsible drawers if needed.
5. Event leaderboard dedupe rule: sort by event primary key records, never by revenue lookup value.
6. For future Graph integration, keep a single `getDashboardData()` provider boundary.
