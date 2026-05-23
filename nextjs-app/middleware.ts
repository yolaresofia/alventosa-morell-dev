import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/app/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/image-sitemap.xml" ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  if ((LOCALES as readonly string[]).includes(firstSegment)) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
