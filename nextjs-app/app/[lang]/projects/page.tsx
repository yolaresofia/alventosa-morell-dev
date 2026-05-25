import { getProjectsGrid, getSettings } from "@/sanity/lib/fetchers";
import { ProjectsGrid } from "./components/ProjectsGrid";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { localizedText } from "@/app/i18n/text";
import { buildSeoMetadata, resolveLocaleParam, resolveLocaleParamSafe } from "@/app/i18n/seo";

export const revalidate = 60;

type RouteParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const locale = await resolveLocaleParamSafe(params);
  if (!locale) return {};

  const settings = await getSettings();

  return buildSeoMetadata({
    locale,
    path: "/projects",
    seo: settings?.projectsPageSeo as SeoFields | null,
    fallbackTitle: settings?.uiText?.pageTitles?.projects,
  });
}

export default async function ProjectsPage({ params }: RouteParams) {
  const locale = await resolveLocaleParam(params);

  const [projects, settings] = await Promise.all([getProjectsGrid(), getSettings()]);

  const h1 = localizedText(settings?.uiText?.pageTitles?.projects, locale);

  return (
    <>
      <h1 className="sr-only">{h1}</h1>
      <ProjectsGrid projects={projects} />
    </>
  );
}
