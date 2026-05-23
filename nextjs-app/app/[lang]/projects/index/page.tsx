import { client } from "@/sanity/lib/client";
import { getProjectsGridQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import ProjectsIndex from "../components/ProjectsIndex";
import { GetProjectsGridQueryResult } from "@/sanity.types";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";
import { isLocale, type Locale } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";
import { notFound } from "next/navigation";

export const revalidate = 60;

const PROJECTS_INDEX_FALLBACK_TITLE: Record<Locale, string> = {
  ca: "Índex de Projectes",
  es: "Índice de Proyectos",
  en: "Project Index",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  const settings = await client.fetch(settingsQuery);
  const seo = settings?.projectsPageSeo as SeoFields | null;

  const title =
    getSeoText(seo?.seoTitle, locale) || PROJECTS_INDEX_FALLBACK_TITLE[locale];
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}/projects/index`,
      languages: buildLanguageAlternates("/projects/index"),
    },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = await client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery);

  if (!projects?.length) {
    return <div>No projects found</div>;
  }

  return (
    <>
      <h1 className="sr-only">{PROJECTS_INDEX_FALLBACK_TITLE[lang as Locale]} — Alventosa Morell Arquitectes</h1>
      <ProjectsIndex projects={projects} />
    </>
  );
}
