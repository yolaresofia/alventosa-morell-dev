import { notFound } from "next/navigation";
import ProjectPageClient from "@/app/components/ProjectPageClient";
import JsonLd from "@/app/components/JsonLd";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

const projectSeoQuery = `*[_type == "project" && slug.current == $slug][0]{
  title,
  seo{
    seoTitle,
    seoDescription,
    seoImage{ ..., alt }
  },
  "description": builder[_type == "projectInfo"][0].description
}`;

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`);

  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch(projectSeoQuery, { slug });

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const seo = project.seo;
  const title = seo?.seoTitle || project.title || "Projecte";
  const description = seo?.seoDescription || undefined;
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: { canonical: `/projects/${slug}` },
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inici",
        item: "https://alventosamorell.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projectes",
        item: "https://alventosamorell.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://alventosamorell.com/projects/${slug}`,
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
