import { getHomepage, getSettings } from "@/sanity/lib/fetchers";
import { urlForImage } from "@/sanity/lib/utils";
import HomePageClient from "@/app/components/HomePageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { localizedText } from "@/app/i18n/text";
import { buildSeoMetadata, resolveLocaleParam, resolveLocaleParamSafe } from "@/app/i18n/seo";

export const revalidate = 60;

type RouteParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const locale = await resolveLocaleParamSafe(params);
  if (!locale) return {};

  const [homepage, settings] = await Promise.all([getHomepage(), getSettings()]);

  return buildSeoMetadata({
    locale,
    path: "",
    seo: homepage?.seo as SeoFields | null,
    fallbackTitle: settings?.uiText?.pageTitles?.home,
  });
}

export default async function Home({ params }: RouteParams) {
  const locale = await resolveLocaleParam(params);

  const [homepage, settings] = await Promise.all([getHomepage(), getSettings()]);

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() ?? null : null;
  const logoAltText = settings?.logo?.altText ?? null;

  const h1 = localizedText(settings?.uiText?.pageTitles?.home, locale);

  return (
    <>
      <h1 className="sr-only">{h1}</h1>
      <HomePageClient homepage={homepage} logoUrl={logoUrl} logoAltText={logoAltText} />
    </>
  );
}
