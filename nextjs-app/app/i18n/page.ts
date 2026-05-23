import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { buildLanguageAlternates } from "./metadata";
import { localizedText, type LocalizedString } from "./text";
import { getSeoText } from "@/sanity/lib/types";
import type { SeoFields } from "@/sanity/lib/types";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  ca: "ca_ES",
  es: "es_ES",
  en: "en_US",
};

/** Resolve and narrow `params.lang` to a `Locale`. Triggers `notFound()` on unsupported values. */
export async function resolveLocaleParam(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

/** Same as `resolveLocaleParam` but returns `null` instead of throwing, for use in `generateMetadata`. */
export async function resolveLocaleParamSafe(
  params: Promise<{ lang: string }>,
): Promise<Locale | null> {
  const { lang } = await params;
  return isLocale(lang) ? lang : null;
}

type BuildSeoMetadataInput = {
  locale: Locale;
  /** Path WITHOUT the locale prefix (e.g. "/about", "/projects/villa-x"). Use empty string for the locale root. */
  path: string;
  /** SEO fields from Sanity, if available. */
  seo?: SeoFields | null;
  /** Fallback title when seo.seoTitle is missing. Usually pulled from settings.uiText.pageTitles. */
  fallbackTitle?: LocalizedString | null;
  /** Open Graph `type` (defaults to "website"). */
  openGraphType?: "website" | "article";
};

/** Build a Next.js Metadata object localized for the given locale, with canonical and hreflang alternates wired up. */
export function buildSeoMetadata({
  locale,
  path,
  seo,
  fallbackTitle,
  openGraphType = "website",
}: BuildSeoMetadataInput): Metadata {
  const title =
    getSeoText(seo?.seoTitle, locale) || localizedText(fallbackTitle, locale) || undefined;
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
      locale: OPEN_GRAPH_LOCALE[locale],
      type: openGraphType,
    },
  };
}
