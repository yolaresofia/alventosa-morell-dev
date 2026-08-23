import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/app/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
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
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Legacy pre-i18n Catalan project URLs: /projectes[/<category>[/<slug>]].
  // Consolidate them onto the new /ca/projects[/<slug>] instead of letting the
  // generic locale prefix turn them into /ca/projectes/... (a 404), so old
  // indexed links keep working and pass their SEO equity to the new URLs.
  if (firstSegment === "projectes") {
    const segments = pathname.split("/").filter(Boolean); // ["projectes", cat?, slug?]
    const slug = segments.length >= 3 ? segments[segments.length - 1] : null;
    const legacyUrl = request.nextUrl.clone();
    legacyUrl.pathname = slug
      ? `/${DEFAULT_LOCALE}/projects/${slug}`
      : `/${DEFAULT_LOCALE}/projects`;
    return NextResponse.redirect(legacyUrl, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
