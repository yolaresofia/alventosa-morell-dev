import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import type { GetProjectsGridQueryResult } from "@/sanity.types";
import type { Locale } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";
import type { UiText } from "@/app/i18n/uiText";
import ProjectsIndexHoverState from "./ProjectsIndexHoverState";

type ProjectsIndexProps = {
  projects: GetProjectsGridQueryResult;
  uiText?: UiText | null;
  locale: Locale;
};

function formatProgram(value: string | null | undefined): string {
  if (!value) return "-";
  const withoutCasa = value.replace(/^Casa\s+/i, "").trim();
  return withoutCasa.charAt(0).toUpperCase() + withoutCasa.slice(1);
}

/**
 * Projects index table rendered server-side. Every row, column, link and
 * thumbnail ships in the initial HTML for SEO. The desktop hover-to-expand
 * behavior is delegated to a small client island that toggles inline styles
 * via data attributes; no content re-render.
 */
export default function ProjectsIndex({ projects, uiText, locale }: ProjectsIndexProps) {
  const columnTitles = uiText?.projectsIndexColumns;

  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = Number.parseInt(a.projectInfo?.year?.value || "0", 10);
    const yearB = Number.parseInt(b.projectInfo?.year?.value || "0", 10);
    if (yearA !== yearB) return yearB - yearA;
    const numberA = Number(a.projectNumber) || 0;
    const numberB = Number(b.projectNumber) || 0;
    return numberB - numberA;
  });

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-12">
      <ProjectsIndexHoverState />
      <div className="grid grid-cols-5 md:grid-cols-9 font-medium text-xs border-b-[0.5px] border-black/70 pb-2 mb-4">
        <div className="col-span-4 md:col-span-3">{localizedText(columnTitles?.project, locale)}</div>
        <div className="hidden md:block md:col-span-2">{localizedText(columnTitles?.program, locale)}</div>
        <div className="hidden md:block md:col-span-2">{localizedText(columnTitles?.location, locale)}</div>
        <div className="hidden md:block md:col-span-1">{localizedText(columnTitles?.area, locale)}</div>
        <div className="col-span-1 md:col-span-1 text-right">{localizedText(columnTitles?.year, locale)}</div>
      </div>

      <div className="flex flex-col" data-projects-index>
        {sortedProjects.map((project) => {
          const slug = project.slug.current;
          const rawProgram = localizedText(project.projectInfo?.program?.value, locale);
          const program = formatProgram(rawProgram);
          const location = localizedText(project.projectInfo?.location?.value, locale) || "-";
          const area = project.projectInfo?.area?.value || "-";
          const year = project.projectInfo?.year?.value || "-";
          const isClickable = !project.notClickableInIndex;
          const thumbnail = project.thumbnail;
          const hasThumbnail = !!thumbnail;

          const projectTitle = project.projectNumber
            ? `${project.projectNumber} ${project.title}`
            : project.title;
          const thumbnailAltFromSanity = thumbnail
            ? localizedText(thumbnail.altText, locale)
            : undefined;
          const thumbnailAlt =
            thumbnailAltFromSanity || project.title || project.projectNumber || "Project thumbnail";

          const desktopRow = (
            <div
              data-project-row-content
              className={`grid grid-cols-5 md:grid-cols-9 text-sm monitor:text-xl items-center py-1.5 transition-colors duration-200 ${
                isClickable ? "data-[active=true]:text-red-500 hover:text-red-500" : ""
              }`}
            >
              <div className="col-span-4 md:col-span-3 font-medium">{projectTitle}</div>
              <div className="hidden md:block md:col-span-2">{program}</div>
              <div className="hidden md:block md:col-span-2">{location}</div>
              <div className="hidden md:block md:col-span-1">{area}</div>
              <div className="col-span-1 md:col-span-1 text-right">{year}</div>
            </div>
          );

          return (
            <div key={slug} className="group" data-project-row data-slug={slug}>
              {/* Desktop: hover expands the thumbnail */}
              <div className="hidden md:block">
                {isClickable ? (
                  <Link href={`/${locale}/projects/${slug}`}>{desktopRow}</Link>
                ) : (
                  desktopRow
                )}

                {hasThumbnail && (
                  <div
                    data-project-thumbnail-wrapper
                    className="overflow-hidden bg-white"
                    style={{
                      height: "0px",
                      transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div
                      data-project-thumbnail-inner
                      className="relative h-full w-full"
                      style={{
                        opacity: 0,
                        transform: "translateY(10px)",
                        transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
                      }}
                    >
                      <Image
                        src={urlForImage(thumbnail)?.url() || "/placeholder.svg"}
                        alt={thumbnailAlt}
                        fill
                        className="object-contain"
                        style={{ objectPosition: "left" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile: simple link row, no hover */}
              <div className="block md:hidden">
                {isClickable ? (
                  <Link
                    href={`/${locale}/projects/${slug}`}
                    className="grid grid-cols-5 text-sm monitor:text-xl items-center py-1.5"
                  >
                    <div className="col-span-4 font-medium">{projectTitle}</div>
                    <div className="col-span-1 text-right">{year}</div>
                  </Link>
                ) : (
                  <div className="grid grid-cols-5 text-sm monitor:text-xl items-center py-1.5">
                    <div className="col-span-4 font-medium">{projectTitle}</div>
                    <div className="col-span-1 text-right">{year}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
