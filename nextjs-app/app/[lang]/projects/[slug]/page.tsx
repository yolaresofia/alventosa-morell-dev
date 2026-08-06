import { notFound } from "next/navigation";
import ProjectPageContent from "@/app/components/ProjectPageContent";
import JsonLd from "@/app/components/JsonLd";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/utils";
import { getSettings } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { LOCALES } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";
import { buildSeoMetadata, resolveLocaleParam, resolveLocaleParamSafe } from "@/app/i18n/seo";
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

type PageParams = Promise<{ lang: string; slug: string }>;
type PageSearchParams = Promise<{ cat?: string }>;

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );

  return LOCALES.flatMap((lang) =>
    slugs.map((s: { slug: string }) => ({ lang, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
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

  const projectDescription = localizedText(project.description, locale);
  const fallbackDescription = projectDescription
    ? projectDescription.length > 155
      ? projectDescription.slice(0, 152).trimEnd() + "…"
      : projectDescription
    : undefined;

  return buildSeoMetadata({
    locale,
    path: `/projects/${resolved.slug}`,
    seo: project.seo as SeoFields | null,
    fallbackTitle: project.title
      ? { ca: project.title, es: project.title, en: project.title }
      : settings?.uiText?.pageTitles?.projects,
    fallbackDescription,
    openGraphType: "article",
  });
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const resolved = await params;
  const { cat } = await searchParams;
  const selectedCategory = cat || "all";
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

  const info = project.builder?.find((b: any) => b._type === "projectInfo");
  const projectDesc = localizedText(info?.description, locale);
  const projectLocation = localizedText(info?.location?.value, locale);
  const projectYear = info?.year?.value;
  const coverBlock = project.builder?.find(
    (b: any) => b._type === "coverImage" && b.image,
  );
  const heroImageUrl = coverBlock?.image
    ? urlForImage(coverBlock.image)?.width(1200).url()
    : null;

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/${locale}/projects/${slug}#project`,
    name: project.title,
    url: `${SITE_URL}/${locale}/projects/${slug}`,
    ...(projectDesc && { description: projectDesc }),
    creator: { "@id": `${SITE_URL}/#organization` },
    ...(projectLocation && {
      locationCreated: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: projectLocation,
          addressCountry: "ES",
        },
      },
    }),
    ...(heroImageUrl && { image: heroImageUrl }),
    ...(projectYear && { dateCreated: String(projectYear) }),
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={creativeWorkJsonLd} />
      <h1 className="sr-only">{project.title}</h1>
      <ProjectPageContent
        project={project}
        allProjects={allProjects}
        locale={locale}
        selectedCategory={selectedCategory}
      />
    </>
  );
}
