"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { GetProjectsGridQueryResult } from "@/sanity.types";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";

export function ProjectsGrid({
  projects,
}: {
  projects: GetProjectsGridQueryResult;
}) {
  const { category } = useProjectCategory();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) =>
    category === "all" ? true : project.category === category
  );

  return (
    <section className="relative w-full min-h-screen px-16 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-16">
        {filteredProjects.map((project) => {
          const imageUrl = project.thumbnail
            ? urlForImage(project.thumbnail)?.url()
            : null;

          const isHovered = hoveredSlug === project.slug.current;

          return (
            <Link
              href={`/projects/${project.slug.current}`}
              key={project.slug.current}
              onMouseEnter={() => setHoveredSlug(project.slug.current)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="flex flex-col items-start transition-opacity duration-300"
            >
              <div
                className={`relative w-full aspect-[3/4] transition-opacity duration-300 ${
                  isHovered ? "lg:opacity-100" : "lg:opacity-20"
                }`}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div
                className={`mt-2 min-h-[24px] text-sm font-medium leading-tight flex transition-opacity duration-300 ${
                  isHovered ? "lg:opacity-100" : "lg:opacity-20"
                }`}
              >
                {isHovered && (
                  <div className="flex">
                    <div className="pr-2">{project.projectNumber || "-"}</div>
                    <div>{project.title}</div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
