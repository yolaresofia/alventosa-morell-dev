"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlForImage } from "@/sanity/lib/utils"
import { useLocale } from "@/app/i18n/client"
import type { GetProjectsGridQueryResult } from "@/sanity.types"
import { localizedText } from "@/app/i18n/text"
import type { UiText } from "@/app/i18n/uiText"

type ProjectsIndexProps = {
  projects: GetProjectsGridQueryResult
  uiText?: UiText | null
}

export default function ProjectsIndex({ projects, uiText }: ProjectsIndexProps) {
  const locale = useLocale()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const columnTitles = uiText?.projectsIndexColumns

  const formatProgram = (value: string | null | undefined) => {
    if (!value) return "-"
    const withoutCasa = value.replace(/^Casa\s+/i, "").trim()
    return withoutCasa.charAt(0).toUpperCase() + withoutCasa.slice(1)
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = Number.parseInt(a.projectInfo?.year?.value || "0", 10)
    const yearB = Number.parseInt(b.projectInfo?.year?.value || "0", 10)

    if (yearA !== yearB) {
      return yearB - yearA // Descending by year
    }

    const numberA = Number(a.projectNumber) || 0
    const numberB = Number(b.projectNumber) || 0
    return numberB - numberA // Descending by projectNumber
  })

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-12">
      <div className="grid grid-cols-5 md:grid-cols-9 font-medium text-xs border-b-[0.5px] border-black/70 pb-2 mb-4">
        <div className="col-span-4 md:col-span-3">{localizedText(columnTitles?.project, locale)}</div>
        <div className="hidden md:block md:col-span-2">{localizedText(columnTitles?.program, locale)}</div>
        <div className="hidden md:block md:col-span-2">{localizedText(columnTitles?.location, locale)}</div>
        <div className="hidden md:block md:col-span-1">{localizedText(columnTitles?.area, locale)}</div>
        <div className="col-span-1 md:col-span-1 text-right">{localizedText(columnTitles?.year, locale)}</div>
      </div>

      <div className="flex flex-col">
        {sortedProjects.map((project) => {
          const isExpanded = activeSlug === project.slug.current
          const rawProgram = localizedText(project.projectInfo?.program?.value, locale)
          const program = formatProgram(rawProgram)
          const location = localizedText(project.projectInfo?.location?.value, locale) || "-"
          const area = project.projectInfo?.area?.value || "-"
          const year = project.projectInfo?.year?.value || "-"
          const isClickable = !project.notClickableInIndex
          const thumbnail = project.thumbnail
          const hasThumbnail = !!thumbnail

          const projectTitle = project.projectNumber ? `${project.projectNumber} ${project.title}` : project.title
          const thumbnailAltFromSanity = thumbnail ? localizedText(thumbnail.altText, locale) : undefined
          const thumbnailAlt =
            thumbnailAltFromSanity || project.title || project.projectNumber || "Project thumbnail"

          const DesktopRow = () => (
            <div
              className={`grid grid-cols-5 md:grid-cols-9 text-sm monitor:text-xl items-center py-1.5 transition-colors duration-200 ${
                isExpanded && isClickable ? "text-red-500" : isClickable ? "hover:text-red-500" : ""
              }`}
            >
              <div className="col-span-4 md:col-span-3 font-medium">{projectTitle}</div>
              <div className="hidden md:block md:col-span-2">{program}</div>
              <div className="hidden md:block md:col-span-2">{location}</div>
              <div className="hidden md:block md:col-span-1">{area}</div>
              <div className="col-span-1 md:col-span-1 text-right">{year}</div>
            </div>
          )

          return (
            <div key={project.slug.current} className="group">
              <div
                className="hidden md:block"
                onMouseEnter={() => setActiveSlug(project.slug.current)}
                onMouseLeave={() => setActiveSlug(null)}
              >
                {isClickable ? (
                  <Link href={`/${locale}/projects/${project.slug.current}`}>
                    <DesktopRow />
                  </Link>
                ) : (
                  <DesktopRow />
                )}

                {hasThumbnail && (
                  <div
                    className="overflow-hidden bg-white"
                    style={{
                      height: isExpanded ? "300px" : "0px",
                      transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div
                      className="relative h-full w-full"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? "translateY(0)" : "translateY(10px)",
                        transition: isExpanded
                          ? "opacity 0.25s ease-out 0.4s, transform 0.25s ease-out 0.4s"
                          : "opacity 0.15s ease-out, transform 0.15s ease-out",
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

              <div className="block md:hidden">
                {isClickable ? (
                  <Link
                    href={`/${locale}/projects/${project.slug.current}`}
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
          )
        })}
      </div>
    </section>
  )
}
