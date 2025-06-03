"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

import { useProjectCategory } from "@/app/context/ProjectCategoryContext";
import { ImageSliderProvider } from "@/app/context/ImageSliderContext";
import PageBuilderPage from "@/app/components/PageBuilder";
import PopupSlider from "@/app/components/PopupSlider";

type Props = {
  project: any;
  allProjects: any[];
  settings: any;
};

export default function ProjectPageClient({
  project,
  allProjects,
  settings,
}: Props) {
  const { setCategory } = useProjectCategory();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("cat") || "all";

  useEffect(() => {
    if (project?.category) {
      setCategory(project.category);
    }
  }, [project?.category, setCategory]);

  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const catQuery = selectedCategory !== "all" ? `?cat=${selectedCategory}` : "";

  return (
    <div className="bg-white min-h-screen relative">
      <Head>
        <title>{project.title}</title>
      </Head>
      <ImageSliderProvider>
        <PageBuilderPage page={project} />
        <PopupSlider />
        <div className="flex items-center text-sm px-6 mb-24">
          {prevProject && (
            <Link
              href={`/projects/${prevProject.slug}${catQuery}`}
              className="flex items-center pr-8 group"
            >
              <span className="group-hover:text-red-500 transition-colors">
                &larr;
              </span>
              <span className="group-hover:text-red-500 transition-colors">
                {prevProject.projectNumber}
              </span>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}${catQuery}`}
              className="flex items-center group"
            >
              <span className="group-hover:text-red-500 transition-colors">
                {nextProject.projectNumber}
              </span>
              <span className="group-hover:text-red-500 transition-colors">
                &rarr;
              </span>
            </Link>
          )}
        </div>
      </ImageSliderProvider>
    </div>
  );
}
