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

type LangInput = Promise<{ lang: string }> | { lang: string } | string;

async function readLang(input: LangInput): Promise<string> {
  if (typeof input === "string") return input;
  const resolved = await input;
  return resolved.lang;
}

/** Resolve and narrow `params.lang` to a `Locale`. Triggers `notFound()` on unsupported values. Accepts a params promise, a resolved params object, or a raw string. */
export async function resolveLocaleParam(input: LangInput): Promise<Locale> {
  const lang = await readLang(input);
  if (!isLocale(lang)) notFound();
  return lang;
}

/** Same as `resolveLocaleParam` but returns `null` instead of throwing, for use in `generateMetadata`. */
export async function resolveLocaleParamSafe(input: LangInput): Promise<Locale | null> {
  const lang = await readLang(input);
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
  /** Fallback description (already resolved to a plain string) when seo.seoDescription is missing. */
  fallbackDescription?: string | null;
  /** Open Graph `type` (defaults to "website"). */
  openGraphType?: "website" | "article";
};

/** Build a Next.js Metadata object localized for the given locale, with canonical and hreflang alternates wired up. */
export function buildSeoMetadata({
  locale,
  path,
  seo,
  fallbackTitle,
  fallbackDescription,
  openGraphType = "website",
}: BuildSeoMetadataInput): Metadata {
  const title =
    getSeoText(seo?.seoTitle, locale) || localizedText(fallbackTitle, locale) || undefined;
  // Treat a seoDescription that merely repeats the title as "not a real description"
  // (many docs have it auto-filled with the page/project name) and fall back to the
  // richer description instead.
  const seoDescription = getSeoText(seo?.seoDescription, locale);
  const description =
    seoDescription && seoDescription !== title
      ? seoDescription
      : fallbackDescription || seoDescription || undefined;
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
