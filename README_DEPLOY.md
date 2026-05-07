# Holt Analytics Gulls Command Center — Tailwind Pro Build

This is the Tailwind/Recharts premium dashboard rebuild.

## Environment variables

Use the same variables as before:

```env
GULLS_DASHBOARD_PASSCODE=Gulls2026!
GULLS_AUTH_SECRET=holt-analytics-super-long-private-secret-2026-change-this
```

## Deploy

From your GitHub repo folder:

```bash
rsync -a --delete --exclude='.git' --exclude='.vercel' --exclude='node_modules' ~/Downloads/holtanalytics-gulls-dashboard-tailwind-pro/ ./
npm install
npm run build
git add .
git commit -m "Rebuild premium Tailwind dashboard"
git push origin main
```

Vercel should redeploy automatically.
