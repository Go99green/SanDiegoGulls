import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPath =
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  if (publicPath) return NextResponse.next();

  const passcode = process.env.GULLS_DASHBOARD_PASSCODE;
  const secret = process.env.GULLS_AUTH_SECRET;

  if (!passcode || !secret) {
    return new NextResponse("Dashboard access is not configured.", { status: 500 });
  }

  const expected = await createToken(passcode, secret);
  const actual = request.cookies.get(COOKIE_NAME)?.value;

  if (actual !== expected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/dashboard-data/:path*"],
};
