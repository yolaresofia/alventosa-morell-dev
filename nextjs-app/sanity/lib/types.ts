export type SeoFields = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImage?: {
    asset?: { _ref: string };
    alt?: string;
    [key: string]: unknown;
  } | null;
};
