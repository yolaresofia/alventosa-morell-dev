import { client } from "@/sanity/lib/client";
import { getProjectsGridQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { GetProjectsGridQueryResult } from "@/sanity.types";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(settingsQuery);
  const seo = settings?.projectsPageSeo as SeoFields | null;

  const title = getSeoText(seo?.seoTitle) || "Projectes";
  const description = getSeoText(seo?.seoDescription);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: { canonical: "/projects" },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectsPage() {
  const projects = await client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery);

  return (
    <>
      <h1 className="sr-only">Projectes — Alventosa Morell Arquitectes</h1>
      <ProjectsGrid projects={projects} />
    </>
  );
}
