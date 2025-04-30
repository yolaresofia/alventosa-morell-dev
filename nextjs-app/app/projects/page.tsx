import { client } from "@/sanity/lib/client";
import { getProjectsGridQuery } from "@/sanity/lib/queries";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { GetProjectsGridQueryResult } from "@/sanity.types"; // Correct type!

export default async function ProjectsPage() {
  const projects = await client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery);

  return <ProjectsGrid projects={projects} />;
}