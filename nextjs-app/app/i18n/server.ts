import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
