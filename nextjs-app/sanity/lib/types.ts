import { DEFAULT_LOCALE, type Locale } from "@/app/i18n/config";

export type LocalizedString = {
  ca?: string | null;
  es?: string | null;
  en?: string | null;
};

export type SeoFields = {
  seoTitle?: LocalizedString | null;
  seoDescription?: LocalizedString | null;
  seoImage?: {
    asset?: { _ref: string };
    altText?: LocalizedString | null;
    [key: string]: unknown;
  } | null;
};

/** Pick the best available SEO string, preferring the given locale and falling back through ca → es → en. */
export function getSeoText(
  field: LocalizedString | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string | undefined {
  if (!field) return undefined;
  return field[locale] || field.ca || field.es || field.en || undefined;
}
