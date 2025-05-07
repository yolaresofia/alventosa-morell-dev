"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { GetProjectsGridQueryResult } from "@/sanity.types";
import { getTranslation } from "@/app/utils/translations";

type ProjectsIndexProps = {
  projects: GetProjectsGridQueryResult;
};

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const { language } = useLanguage();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const columnTitles = {
    project: { ca: "Projecte", es: "Proyecto", en: "Project" },
    program: { ca: "Programa", es: "Programa", en: "Program" },
    location: { ca: "Ubicació", es: "Ubicación", en: "Location" },
    area: { ca: "Àrea", es: "Área", en: "Area" },
    year: { ca: "Any", es: "Año", en: "Year" },
  };

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24">
      <div className="grid grid-cols-5 font-medium text-xs border-b-[0.5px] border-black pb-2 mb-4">
        <div>{getTranslation(columnTitles.project, language)}</div>
        <div>{getTranslation(columnTitles.program, language)}</div>
        <div>{getTranslation(columnTitles.location, language)}</div>
        <div>{getTranslation(columnTitles.area, language)}</div>
        <div>{getTranslation(columnTitles.year, language)}</div>
      </div>

      <div className="flex flex-col">
        {projects.map((project) => {
          const isHovered = hoveredSlug === project.slug.current;
          const program =
            getTranslation(project.projectInfo?.program?.value, language) ||
            "-";
          const location =
            getTranslation(project.projectInfo?.location?.value, language) ||
            "-";
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
                className={`grid grid-cols-5 text-sm items-center transition-colors duration-300 py-1.5 ${
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
                <div className="py-2">
                  <div className="relative h-64 w-auto">
                    <Image
                      src={urlForImage(project.thumbnail)?.url() || ""}
                      alt={project.title}
                      fill
                      className="object-contain"
                      style={{ objectPosition: "left" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
