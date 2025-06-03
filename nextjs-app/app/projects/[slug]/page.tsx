import { notFound } from "next/navigation"
import ProjectPageClient from "@/app/components/ProjectPageClient"
import { client } from "@/sanity/lib/client"
import { sanityFetch } from "@/sanity/lib/live"
import { settingsQuery } from "@/sanity/lib/queries"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`)

  return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Get the slug directly without destructuring first
  const slug = params.slug
  const project = await client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug })

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }

  return {
    title: project?.title || "Projecte",
    description: project?.title || "",
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  // Get the slug directly without destructuring first
  const slug = params.slug

  const [project, allProjects, settings] = await Promise.all([
    client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug }),
    client.fetch(
      `*[_type == "project" && defined(slug.current)] | order(projectNumber asc){
        "slug": slug.current,
        projectNumber,
        category
      }`,
    ),
    sanityFetch({ query: settingsQuery }),
  ])

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} allProjects={allProjects} settings={settings?.data} />
}
