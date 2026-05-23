import { notFound } from "next/navigation";
import ProjectPageClient from "@/app/components/ProjectPageClient";
import JsonLd from "@/app/components/JsonLd";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";
import { LOCALES, isLocale, type Locale } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";

export const revalidate = 60;

const SITE_URL = "https://www.alventosamorell.com";

const BREADCRUMB_LABELS: Record<Locale, { home: string; projects: string }> = {
  ca: { home: "Inici", projects: "Projectes" },
  es: { home: "Inicio", projects: "Proyectos" },
  en: { home: "Home", projects: "Projects" },
};

const NOT_FOUND_METADATA: Record<Locale, { title: string; description: string }> = {
  ca: { title: "Projecte no trobat", description: "El projecte sol·licitat no s'ha pogut trobar." },
  es: { title: "Proyecto no encontrado", description: "El proyecto solicitado no se pudo encontrar." },
  en: { title: "Project Not Found", description: "The requested project could not be found." },
};

const projectSeoQuery = `*[_type == "project" && slug.current == $slug][0]{
  title,
  seo{
    seoTitle,
    seoDescription,
    seoImage{ ..., altText }
  },
  "description": builder[_type == "projectInfo"][0].description
}`;

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );

  return LOCALES.flatMap((lang) =>
    slugs.map((s: { slug: string }) => ({ lang, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  const project = await client.fetch(projectSeoQuery, { slug });

  if (!project) {
    return NOT_FOUND_METADATA[locale];
  }

  const seo = project.seo as SeoFields | null;
  const title =
    getSeoText(seo?.seoTitle, locale) || project.title || BREADCRUMB_LABELS[locale].projects;
  const description = getSeoText(seo?.seoDescription, locale);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: buildLanguageAlternates(`/projects/${slug}`),
    },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

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
    client.fetch(settingsQuery),
  ]);

  if (!project) {
    notFound();
  }

  const labels = BREADCRUMB_LABELS[locale];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.home,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: labels.projects,
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
