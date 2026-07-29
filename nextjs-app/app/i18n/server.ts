import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Read the request pathname from the `x-pathname` header set by the proxy. Returns "" if unavailable (e.g. excluded routes). */
export async function getPathnameFromHeaders(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") || "";
}

/** Extract the locale from the current request URL via the `x-pathname` header set by the proxy. Useful in not-found.tsx and other places that don't receive params. */
export async function getLocaleFromHeaders(): Promise<Locale> {
  const pathname = await getPathnameFromHeaders();
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? (segment as Locale) : DEFAULT_LOCALE;
}
