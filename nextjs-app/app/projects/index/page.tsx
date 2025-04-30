import { client } from "@/sanity/lib/client";
import { getProjectsGridQuery } from "@/sanity/lib/queries";
import ProjectsIndex from "../components/ProjectsIndex";
import { GetProjectsGridQueryResult } from "@/sanity.types"; // ✅ Import the correct type

export default async function ProjectsIndexPage() {
  const projects = await client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery);

  if (!projects?.length) {
    return <div>No projects found</div>;
  }

  return <ProjectsIndex projects={projects} />;
}