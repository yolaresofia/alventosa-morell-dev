"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { GetProjectsGridQueryResult } from "@/sanity.types";

const categories = [
  { label: "Tots", value: "all" },
  { label: "Unifamiliar", value: "uni" },
  { label: "Plurifamiliar", value: "pluri" },
  { label: "Equipaments", value: "equip" },
];

export function ProjectsGrid({
  projects,
}: {
  projects: GetProjectsGridQueryResult;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section className="relative w-full min-h-screen px-12 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
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
                className={`relative w-full aspect-[4/5] transition-opacity duration-300 ${
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
                className={`mt-2 text-sm font-medium leading-tight flex gap-2 transition-opacity duration-300 ${
                  isHovered ? "lg:opacity-100" : "lg:opacity-20"
                }`}
              >
                <div>{project.projectNumber || "-"}</div>
                <div>{project.title}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-0.5 z-50">
        {categories.map((cat, idx) => (
          <span key={cat.value} className="flex items-center">
            <button
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? "text-red-500"
                  : "text-black hover:text-red-500"
              }`}
            >
              {cat.label}
            </button>
            {idx < categories.length - 1 && <span>,</span>}
          </span>
        ))}
      </div>
    </section>
  );
}
