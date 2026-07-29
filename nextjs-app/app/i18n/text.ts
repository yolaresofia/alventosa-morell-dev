import type { PortableTextBlock } from "next-sanity";
import { DEFAULT_LOCALE, type Locale } from "./config";

/** A string localized into our supported locales. `null` and `undefined` are both treated as missing. */
export type LocalizedString = {
  ca?: string | null;
  es?: string | null;
  en?: string | null;
};

export type LocalizedPortableTextValue = {
  ca?: PortableTextBlock[] | null;
  es?: PortableTextBlock[] | null;
  en?: PortableTextBlock[] | null;
};

/** Pick the best available translation, preferring the given locale and falling back to Catalan, then Spanish, then English. Returns empty string if nothing is set. */
export function localizedText(
  field: LocalizedString | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (!field) return "";
  return field[locale] || field.ca || field.es || field.en || "";
}

/** PortableText variant of localizedText. Returns an empty array if nothing is set. */
export function localizedPortableText(
  field: LocalizedPortableTextValue | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): PortableTextBlock[] {
  if (!field) return [];
  return field[locale] || field.ca || field.es || field.en || [];
}
