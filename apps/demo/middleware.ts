import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/request-otp",
  "/verify-otp",
  "/_next",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublic) return NextResponse.next();

  const token = request.cookies.get("sooq-access-token")?.value;
  if (token) return NextResponse.next();

  const loginUrl = new URL("/request-otp", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
