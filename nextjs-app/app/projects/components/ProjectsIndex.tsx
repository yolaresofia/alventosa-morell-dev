"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { GetProjectsGridQueryResult } from "@/sanity.types";

type ProjectsIndexProps = {
  projects: GetProjectsGridQueryResult;
};

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const { language } = useLanguage();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-12 pt-24">
      <div className="grid grid-cols-5 font-medium text-sm border-b border-black pb-2 mb-4">
        <div>Projecte</div>
        <div>Programa</div>
        <div>Ubicació</div>
        <div>Àrea</div>
        <div>Any</div>
      </div>

      <div className="flex flex-col">
        {projects.map((project) => {
          const isHovered = hoveredSlug === project.slug.current;
          const program =
            project.projectInfo?.program?.value?.[language] || "-";
          const location =
            project.projectInfo?.location?.value?.[language] || "-";
          const area = project.projectInfo?.area?.value || "-";
          const year = project.projectInfo?.year?.value || "-";

          return (
            <div
              key={project.slug.current}
              className="transition-all duration-300"
              onMouseEnter={() => setHoveredSlug(project.slug.current)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              <Link
                href={`/projects/${project.slug.current}`}
                className={`grid grid-cols-5 text-sm items-center transition-colors duration-300 py-2 ${
                  isHovered ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                <div className="font-medium">
                  {project.projectNumber
                    ? `${project.projectNumber} ${project.title}`
                    : project.title}
                </div>
                <div>{program}</div>
                <div>{location}</div>
                <div>{area}</div>
                <div>{year}</div>
              </Link>

              {isHovered && project.thumbnail && (
                <div className="grid grid-cols-5 py-6">
                  <div className="col-span-2">
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={urlForImage(project.thumbnail)?.url() || ""}
                        alt={project.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>
                  <div className="col-span-3"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
