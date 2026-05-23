import { getProjectsGrid, getSettings } from "@/sanity/lib/fetchers";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { ProjectsGrid } from "./components/ProjectsGrid";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";
import { isLocale, type Locale } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";
import { notFound } from "next/navigation";

export const revalidate = 60;

const PROJECTS_FALLBACK_TITLE: Record<Locale, string> = {
  ca: "Projectes",
  es: "Proyectos",
  en: "Projects",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  const settings = await getSettings();
  const seo = settings?.projectsPageSeo as SeoFields | null;

  const title =
    getSeoText(seo?.seoTitle, locale) || PROJECTS_FALLBACK_TITLE[locale];
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: buildLanguageAlternates("/projects"),
    },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = await getProjectsGrid();

  return (
    <>
      <h1 className="sr-only">{PROJECTS_FALLBACK_TITLE[lang as Locale]} — Alventosa Morell Arquitectes</h1>
      <ProjectsGrid projects={projects} />
    </>
  );
}
