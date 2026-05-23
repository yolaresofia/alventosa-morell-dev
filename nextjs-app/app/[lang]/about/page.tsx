import { client } from "@/sanity/lib/client";
import { getAboutPageQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import AboutPageClient from "@/app/components/AboutPageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";
import { isLocale, type Locale } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";
import { notFound } from "next/navigation";

export const revalidate = 60;

const ABOUT_FALLBACK_TITLE: Record<Locale, string> = {
  ca: "Sobre Nosaltres",
  es: "Sobre Nosotros",
  en: "About",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  const about = await client.fetch(getAboutPageQuery);
  const seo = about?.seo as SeoFields | null;

  const title = getSeoText(seo?.seoTitle, locale) || ABOUT_FALLBACK_TITLE[locale];
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}/about`,
      languages: buildLanguageAlternates("/about"),
    },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [about, settings] = await Promise.all([
    client.fetch(getAboutPageQuery),
    client.fetch(settingsQuery),
  ]);

  return (
    <>
      <h1 className="sr-only">{ABOUT_FALLBACK_TITLE[lang as Locale]} — Alventosa Morell Arquitectes</h1>
      <AboutPageClient about={about} uiText={settings?.uiText} />
    </>
  );
}
