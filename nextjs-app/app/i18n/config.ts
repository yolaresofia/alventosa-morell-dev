export const LOCALES = ["ca", "es", "en"] as const;
export const DEFAULT_LOCALE: Locale = "ca";

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
