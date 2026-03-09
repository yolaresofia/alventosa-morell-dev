import { client } from "@/sanity/lib/client";
import { getProjectsGridQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import ProjectsIndex from "../components/ProjectsIndex";
import { GetProjectsGridQueryResult } from "@/sanity.types";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(settingsQuery);
  const seo = settings?.projectsPageSeo as SeoFields | null;

  const title = seo?.seoTitle || "Índex de Projectes";
  const description = seo?.seoDescription || undefined;
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: { canonical: "/projects/index" },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectsIndexPage() {
  const projects = await client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery);

  if (!projects?.length) {
    return <div>No projects found</div>;
  }

  return (
    <>
      <h1 className="sr-only">Índex de Projectes — Alventosa Morell Arquitectes</h1>
      <ProjectsIndex projects={projects} />
    </>
  );
}
