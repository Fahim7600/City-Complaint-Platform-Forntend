import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { ACCESS_TOKEN_KEY } from "@/lib/auth-cookies";
import { ROLE_HOME } from "@/lib/roles";
import type { Role } from "@/types/user";

interface TokenPayload {
  userId?: string;
  role?: Role;
  exp?: number;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  let userRole: Role | null = null;

  if (token) {
    try {
      const decoded = decodeJwt(token) as TokenPayload;
      if (decoded && decoded.role) {
        userRole = decoded.role;
      }
    } catch {
      // In case of malformed token, userRole remains null
    }
  }

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const isPaymentSuccessRoute =
    pathname.startsWith("/payment/success") ||
    pathname.startsWith("/premium/success");

  // Check role-protected prefixes
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/technician") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/notifications") ||
    isPaymentSuccessRoute;

  // 1. If logged-in user visits /login or /register, redirect to their role home
  if (isAuthRoute && userRole) {
    const homeUrl = new URL(ROLE_HOME[userRole] || "/dashboard", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 2. If accessing a protected route without a valid token, redirect to login
  if (isProtected && !userRole) {
    const loginUrl = new URL("/login", request.url);
    const fullPath = `${pathname}${search}`;
    loginUrl.searchParams.set("redirect", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If accessing a role-specific protected route with wrong role
  if (isProtected && userRole) {
    let requiredRole: Role | null = null;

    if (pathname.startsWith("/dashboard")) requiredRole = "CITIZEN";
    else if (pathname.startsWith("/technician")) requiredRole = "TECHNICIAN";
    else if (pathname.startsWith("/manager")) requiredRole = "MANAGER";
    else if (pathname.startsWith("/admin")) requiredRole = "ADMIN";
    // /notifications is accessible to all logged-in roles

    if (requiredRole && userRole !== requiredRole) {
      const deniedHomeUrl = new URL(ROLE_HOME[userRole] || "/dashboard", request.url);
      deniedHomeUrl.searchParams.set("denied", "1");
      return NextResponse.redirect(deniedHomeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .svg, .png, .jpg)
     * - api routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
