import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Extract the locale from the current request URL via the `x-pathname` header set by middleware. Useful in not-found.tsx and other places that don't receive params. */
export async function getLocaleFromHeaders(): Promise<Locale> {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? (segment as Locale) : DEFAULT_LOCALE;
}
