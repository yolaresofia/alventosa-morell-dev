import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import type { GetProjectsGridQueryResult } from "@/sanity.types";
import type { Locale } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";
import ProjectsGridHoverState from "./ProjectsGridHoverState";

type Props = {
  projects: GetProjectsGridQueryResult;
  locale: Locale;
  /** Filter category coming from ?cat=... search param. Defaults to "all". */
  selectedCategory?: string;
};

/**
 * Projects grid rendered server-side. The list, links, images and titles ship
 * in the initial HTML so crawlers index every project under /[lang]/projects
 * (and per category when ?cat=... is set). Hover dimming is delegated to a
 * small client island.
 */
export function ProjectsGrid({ projects, locale, selectedCategory = "all" }: Props) {
  const filteredProjects = projects
    .filter((project) => selectedCategory === "all" || project.category === selectedCategory)
    .filter((project) => !!project.thumbnail)
    .filter((project) => !project.notClickableInIndex)
    .sort((a, b) => {
      const yearA = Number.parseInt(a.projectInfo?.year?.value || "0", 10);
      const yearB = Number.parseInt(b.projectInfo?.year?.value || "0", 10);

      if (yearA !== yearB) return yearB - yearA;

      const numA = Number(a.projectNumber) || 0;
      const numB = Number(b.projectNumber) || 0;
      return numB - numA;
    });

  const firstProjectSlug = filteredProjects[0]?.slug.current || null;

  return (
    <section className="relative w-full min-h-screen px-16 py-20">
      <ProjectsGridHoverState defaultActiveSlug={firstProjectSlug} />
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-16"
        data-projects-grid
      >
        {filteredProjects.map((project) => {
          const thumbnailImage = project.thumbnail;
          if (!thumbnailImage) return null;

          const imageUrl = urlForImage(thumbnailImage)?.url();
          const slug = project.slug.current;
          const altFromSanity = localizedText(thumbnailImage.altText, locale);
          const imageAlt = altFromSanity || project.title || "Project thumbnail";

          return (
            <Link
              href={`/${locale}/projects/${slug}`}
              key={slug}
              data-project-card
              data-slug={slug}
              className="flex flex-col items-start transition-opacity duration-300"
            >
              <div
                data-project-image
                className="relative w-full aspect-[3/4] transition-opacity duration-300 lg:opacity-20"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div
                data-project-title
                className="mt-2 min-h-[24px] text-sm monitor:text-xl font-medium leading-tight transition-opacity duration-300 lg:opacity-0"
              >
                <div className="flex">
                  <div className="pr-2">{project.projectNumber || "-"}</div>
                  <div>{project.title}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
