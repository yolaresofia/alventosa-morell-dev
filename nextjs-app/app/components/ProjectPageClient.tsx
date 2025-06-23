"use client";

import { useEffect, useMemo } from "react";
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

export default function ProjectPageClient({ project, allProjects }: Props) {
  const { setCategory } = useProjectCategory();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("cat") || "all";

  useEffect(() => {
    if (project?.category) {
      setCategory(project.category);
    }
  }, [project?.category, setCategory]);

  const normalizeSlug = (slug: any): string | undefined => {
    if (typeof slug === "string") return slug;
    if (slug && typeof slug === "object" && "current" in slug) return slug.current;
    return undefined;
  };

  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
      .filter((p) => !p.notClickableInIndex)
      .sort((a, b) => {
        const yearA = parseInt(a.projectInfo?.year?.value || "0", 10);
        const yearB = parseInt(b.projectInfo?.year?.value || "0", 10);
        return yearB - yearA;
      });
  }, [allProjects, selectedCategory]);

  const currentIndex = filteredProjects.findIndex(
    (p) => normalizeSlug(p.slug) === normalizeSlug(project.slug)
  );

  const catQuery = selectedCategory !== "all" ? `?cat=${selectedCategory}` : "";

  const prevProject =
    filteredProjects[
      (currentIndex - 1 + filteredProjects.length) % filteredProjects.length
    ];
  const nextProject =
    filteredProjects[(currentIndex + 1) % filteredProjects.length];

  return (
    <div className="bg-white min-h-screen relative">
      <Head>
        <title>{project.title}</title>
      </Head>

      <ImageSliderProvider>
        <PageBuilderPage page={project} />
        <PopupSlider />

        <div className="flex items-center text-sm monitor:text-xl px-6 mb-24">
          {prevProject && (
            <Link
              href={`/projects/${normalizeSlug(prevProject.slug)}${catQuery}`}
              className="flex items-center pr-8 group"
            >
              <span className="group-hover:text-red-500 transition-colors mr-2">
                &larr;
              </span>
              <span className="group-hover:text-red-500 transition-colors">
                {prevProject.projectNumber}
              </span>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/projects/${normalizeSlug(nextProject.slug)}${catQuery}`}
              className="flex items-center group"
            >
              <span className="group-hover:text-red-500 transition-colors mr-2">
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
