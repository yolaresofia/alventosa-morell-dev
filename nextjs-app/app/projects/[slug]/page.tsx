import type { Metadata } from "next";
import Head from "next/head";
import Link from "next/link";

import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current
    }`
  );

  return slugs.map((s: { slug: string }) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  return {
    title: project?.title || "Projecte",
    description: project?.title || "",
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    client.fetch(
      '*[_type == "project" && slug.current == $slug][0]',
      { slug: params.slug }
    ),
    client.fetch(
      `*[_type == "project" && defined(slug.current)] | order(projectNumber asc){
        "slug": slug.current,
        projectNumber
      }`
    ),
  ]);

  if (!project) {
    return <div>Project not found</div>;
  }

  const currentIndex = allProjects.findIndex(
    (p: any) => p.slug === params.slug
  );

  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="bg-white min-h-screen relative">
      <Head>
        <title>{project.title}</title>
      </Head>
      <PageBuilderPage page={project} />
      <div className="flex items-center text-sm px-32 mb-24">
        {prevProject && (
          <Link href={`/projects/${prevProject.slug}`} className="flex items-center pr-8 group">
            <span className="group-hover:text-red-500 transition-colors">&larr;</span>
            <span className="group-hover:text-red-500 transition-colors">{prevProject.projectNumber}</span>
          </Link>
        )}
        {nextProject && (
          <Link href={`/projects/${nextProject.slug}`} className="flex items-center group">
            <span className="group-hover:text-red-500 transition-colors">{nextProject.projectNumber}</span>
            <span className="group-hover:text-red-500 transition-colors">&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
