"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "1";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050607] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(252,76,2,0.22),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(0,136,206,0.18),transparent_34%),linear-gradient(135deg,#050607_0%,#080A0D_45%,#06111A_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.30)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.30)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0B0D10]/90 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="mb-8">
            <div className="mb-6 h-2 w-24 rounded-full bg-[#FC4C02] shadow-[0_0_28px_rgba(252,76,2,.65)]" />

            <p className="text-xs font-black uppercase tracking-[0.45em] text-[#0088CE]">
              Holt Analytics
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight text-white">
              Gulls Command Center
            </h1>

            <p className="mt-5 text-base leading-8 text-[#BFCED6]">
              Protected ticketing analytics dashboard for San Diego Gulls sales,
              pacing, plans, revenue, and data quality.
            </p>
          </div>

          <form action="/api/login" method="POST" className="space-y-5">
            <div>
              <label
                htmlFor="passcode"
                className="mb-2 block text-sm font-black text-[#BFCED6]"
              >
                Access Passcode
              </label>

              <input
                id="passcode"
                name="passcode"
                type="password"
                required
                autoFocus
                placeholder="Enter passcode"
                className="w-full rounded-2xl border border-[#FC4C02]/50 bg-black/60 px-5 py-4 text-lg text-white outline-none shadow-[0_0_0_4px_rgba(252,76,2,.08)] transition placeholder:text-white/25 focus:border-[#FC4C02] focus:shadow-[0_0_0_4px_rgba(252,76,2,.20)]"
              />
            </div>

            {hasError && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                Incorrect passcode. Try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#FC4C02] px-5 py-4 text-base font-black uppercase tracking-wider text-black shadow-[0_0_30px_rgba(252,76,2,.28)] transition hover:scale-[1.01] hover:brightness-110"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-white/35">
              Internal Use
            </p>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050607] text-white">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-[#BFCED6]">
        Loading secure access...
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
