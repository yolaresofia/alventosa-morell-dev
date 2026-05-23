import { notFound } from "next/navigation";
import ProjectPageClient from "@/app/components/ProjectPageClient";
import JsonLd from "@/app/components/JsonLd";
import { client } from "@/sanity/lib/client";
import { getSettings } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { LOCALES } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";
import { buildSeoMetadata, resolveLocaleParam, resolveLocaleParamSafe } from "@/app/i18n/page";
import { SITE_URL } from "@/app/config";

export const revalidate = 60;

const projectSeoQuery = `*[_type == "project" && slug.current == $slug][0]{
  title,
  seo{
    seoTitle,
    seoDescription,
    seoImage{ ..., altText }
  },
  "description": builder[_type == "projectInfo"][0].description
}`;

type RouteParams = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );

  return LOCALES.flatMap((lang) =>
    slugs.map((s: { slug: string }) => ({ lang, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolveLocaleParamSafe(resolved.lang);
  if (!locale) return {};

  const [project, settings] = await Promise.all([
    client.fetch(projectSeoQuery, { slug: resolved.slug }),
    getSettings(),
  ]);

  if (!project) {
    const ui = settings?.uiText?.notFound;
    return {
      title: localizedText(ui?.projectTitle, locale) || undefined,
      description: localizedText(ui?.projectDescription, locale) || undefined,
      robots: { index: false, follow: false },
    };
  }

  return buildSeoMetadata({
    locale,
    path: `/projects/${resolved.slug}`,
    seo: project.seo as SeoFields | null,
    fallbackTitle: project.title
      ? { ca: project.title, es: project.title, en: project.title }
      : settings?.uiText?.pageTitles?.projects,
    openGraphType: "article",
  });
}

export default async function ProjectPage({ params }: RouteParams) {
  const resolved = await params;
  const locale = await resolveLocaleParam(resolved.lang);
  const slug = resolved.slug;

  const [project, allProjects, settings] = await Promise.all([
    client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug }),
    client.fetch(
      `*[_type == "project" && defined(slug.current)]{
        "slug": slug.current,
        projectNumber,
        category,
        "projectInfo": builder[_type == "projectInfo"][0]{
          year
        },
        notClickableInIndex
      }`
    ),
    getSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const nav = settings?.uiText?.navigation;
  const homeLabel = localizedText(nav?.home, locale);
  const projectsLabel = localizedText(nav?.projects, locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: projectsLabel,
        item: `${SITE_URL}/${locale}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${SITE_URL}/${locale}/projects/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <h1 className="sr-only">{project.title}</h1>
      <ProjectPageClient project={project} allProjects={allProjects} settings={settings} />
    </>
  );
}
