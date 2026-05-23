import { getAboutPage, getSettings } from "@/sanity/lib/fetchers";
import AboutPageClient from "@/app/components/AboutPageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { localizedText } from "@/app/i18n/text";
import { buildSeoMetadata, resolveLocaleParam, resolveLocaleParamSafe } from "@/app/i18n/page";

export const revalidate = 60;

type RouteParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const locale = await resolveLocaleParamSafe(params);
  if (!locale) return {};

  const [about, settings] = await Promise.all([getAboutPage(), getSettings()]);

  return buildSeoMetadata({
    locale,
    path: "/about",
    seo: about?.seo as SeoFields | null,
    fallbackTitle: settings?.uiText?.pageTitles?.about,
  });
}

export default async function AboutPage({ params }: RouteParams) {
  const locale = await resolveLocaleParam(params);

  const [about, settings] = await Promise.all([getAboutPage(), getSettings()]);

  const h1 = localizedText(settings?.uiText?.pageTitles?.about, locale);

  return (
    <>
      <h1 className="sr-only">{h1}</h1>
      <AboutPageClient about={about} uiText={settings?.uiText} />
    </>
  );
}
