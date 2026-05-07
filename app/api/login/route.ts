import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedPasscode = String(formData.get("passcode") || "");
  const correctPasscode = process.env.GULLS_DASHBOARD_PASSCODE;
  const secret = process.env.GULLS_AUTH_SECRET;

  if (!correctPasscode || !secret) {
    return NextResponse.json({ error: "Dashboard access is not configured." }, { status: 500 });
  }

  if (submittedPasscode !== correctPasscode) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
  }

  const token = await createToken(correctPasscode, secret);
  const response = NextResponse.redirect(new URL("/dashboard", request.url), { status: 303 });

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
