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

/** Pick the best available SEO string, defaulting to Catalan. */
export function getSeoText(field: LocalizedString | null | undefined): string | undefined {
  if (!field) return undefined;
  return field.ca || field.es || field.en || undefined;
}
