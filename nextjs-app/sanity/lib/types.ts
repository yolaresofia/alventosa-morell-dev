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

export type Locale = "ca" | "es" | "en";

/** Pick the best available SEO string, preferring the given locale and falling back to Catalan, then Spanish, then English. */
export function getSeoText(
  field: LocalizedString | null | undefined,
  locale: Locale = "ca",
): string | undefined {
  if (!field) return undefined;
  return field[locale] || field.ca || field.es || field.en || undefined;
}
