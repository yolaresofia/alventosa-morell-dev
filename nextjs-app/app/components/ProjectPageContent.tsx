import Link from "next/link";

import { ImageSliderProvider } from "@/app/context/ImageSliderContext";
import PageBuilder from "@/app/components/PageBuilder";
import PopupSlider from "@/app/components/PopupSlider";
import ProjectCategorySync from "@/app/components/ProjectCategorySync";
import type { Locale } from "@/app/i18n/config";

type Props = {
  project: any;
  allProjects: any[];
  locale: Locale;
  selectedCategory: string;
  heroPoster?: string | null;
};

function normalizeSlug(slug: any): string | undefined {
  if (typeof slug === "string") return slug;
  if (slug && typeof slug === "object" && "current" in slug) return slug.current;
  return undefined;
}

/**
 * Server-rendered project detail page. The builder content, prev/next nav
 * links and breadcrumb data all ship in the initial HTML for crawlers. The
 * popup slider lives inside its client provider but the builder blocks it
 * wraps are still server components.
 */
export default function ProjectPageContent({
  project,
  allProjects,
  locale,
  selectedCategory,
  heroPoster = null,
}: Props) {
  const filteredProjects = allProjects
    .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
    .filter((p) => !p.notClickableInIndex)
    .sort((a, b) => {
      const yearA = parseInt(a.projectInfo?.year?.value || "0", 10);
      const yearB = parseInt(b.projectInfo?.year?.value || "0", 10);
      return yearB - yearA;
    });

  const currentIndex = filteredProjects.findIndex(
    (p) => normalizeSlug(p.slug) === normalizeSlug(project.slug),
  );

  const catQuery = selectedCategory !== "all" ? `?cat=${selectedCategory}` : "";

  const prevProject =
    filteredProjects.length > 0
      ? filteredProjects[(currentIndex - 1 + filteredProjects.length) % filteredProjects.length]
      : undefined;
  const nextProject =
    filteredProjects.length > 0
      ? filteredProjects[(currentIndex + 1) % filteredProjects.length]
      : undefined;

  return (
    <div className="bg-white min-h-screen relative">
      <ProjectCategorySync category={project?.category} />
      <ImageSliderProvider>
        <PageBuilder page={project} locale={locale} heroPoster={heroPoster} />
        <PopupSlider />

        <div className="flex items-center text-sm monitor:text-xl px-6 mb-24">
          {prevProject && (
            <Link
              href={`/${locale}/projects/${normalizeSlug(prevProject.slug)}${catQuery}`}
              className="flex items-center pr-8 group"
            >
              <span className="group-hover:text-red-500 transition-colors mr-2">&larr;</span>
              <span className="group-hover:text-red-500 transition-colors">
                {prevProject.projectNumber}
              </span>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/${locale}/projects/${normalizeSlug(nextProject.slug)}${catQuery}`}
              className="flex items-center group"
            >
              <span className="group-hover:text-red-500 transition-colors mr-2">
                {nextProject.projectNumber}
              </span>
              <span className="group-hover:text-red-500 transition-colors">&rarr;</span>
            </Link>
          )}
        </div>
      </ImageSliderProvider>
    </div>
  );
}
