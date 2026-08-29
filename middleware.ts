import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "session_id";

// Routes that require a logged-in user.
const PROTECTED_PREFIXES = ["/account", "/checkout", "/orders"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * OPTIMISTIC CHECK ONLY.
   * Middleware runs on the Edge runtime: no node:crypto, and no
   * access to the session store. All it can do is ask "is there a
   * session cookie at all?" - it cannot tell whether it is valid.
   * The real check lives in the page (app/account/page.tsx).
   */
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Remember where they were going so we can send them back.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Deliberately NOT bouncing logged-in users away from /login here.
   * A cookie can exist while its session is dead (server restart,
   * expiry, forged value). Bouncing on the cookie alone creates an
   * infinite redirect loop with the page's real check.
   * The login page does that redirect itself, after verifying.
   */
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/orders/:path*"],
};
