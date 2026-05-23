import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { getHomepageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import HomePageClient from "@/app/components/HomePageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";
import { isLocale, type Locale } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  const homepage = await client.fetch(getHomepageQuery);

  const seo = homepage?.seo as SeoFields | null;
  const title = getSeoText(seo?.seoTitle, locale);
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}`,
      languages: buildLanguageAlternates(""),
    },
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [homepage, settings] = await Promise.all([
    client.fetch(getHomepageQuery),
    client.fetch(settingsQuery),
  ]);

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() ?? null : null;
  const logoAltText = settings?.logo?.altText ?? null;

  return (
    <>
      <h1 className="sr-only">Alventosa Morell Arquitectes</h1>
      <HomePageClient homepage={homepage} logoUrl={logoUrl} logoAltText={logoAltText} />
    </>
  );
}
