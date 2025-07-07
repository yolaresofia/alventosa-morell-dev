"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlForImage } from "@/sanity/lib/utils"
import { useLanguage } from "@/app/context/LanguageContext"
import type { GetProjectsGridQueryResult } from "@/sanity.types"
import { getTranslation } from "@/app/utils/translations"

type ProjectsIndexProps = {
  projects: GetProjectsGridQueryResult
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const { language } = useLanguage()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const columnTitles = {
    project: { ca: "Projecte", es: "Proyecto", en: "Project" },
    program: { ca: "Programa", es: "Programa", en: "Program" },
    location: { ca: "Ubicació", es: "Ubicación", en: "Location" },
    area: { ca: "Àrea", es: "Área", en: "Area" },
    year: { ca: "Any", es: "Año", en: "Year" },
  }

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
        <div className="col-span-4 md:col-span-3">{getTranslation(columnTitles.project, language)}</div>
        <div className="hidden md:block md:col-span-2">{getTranslation(columnTitles.program, language)}</div>
        <div className="hidden md:block md:col-span-2">{getTranslation(columnTitles.location, language)}</div>
        <div className="hidden md:block md:col-span-1">{getTranslation(columnTitles.area, language)}</div>
        <div className="col-span-1 md:col-span-1 text-right">{getTranslation(columnTitles.year, language)}</div>
      </div>

      <div className="flex flex-col">
        {sortedProjects.map((project) => {
          const isExpanded = activeSlug === project.slug.current
          const rawProgram = getTranslation(project.projectInfo?.program?.value, language)
          const program = formatProgram(rawProgram)
          const location = getTranslation(project.projectInfo?.location?.value, language) || "-"
          const area = project.projectInfo?.area?.value || "-"
          const year = project.projectInfo?.year?.value || "-"
          const isClickable = !project.notClickableInIndex
          const hasThumbnail = !!project.thumbnail

          const projectTitle = project.projectNumber ? `${project.projectNumber} ${project.title}` : project.title

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
                  <Link href={`/projects/${project.slug.current}`}>
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
                        src={urlForImage(project.thumbnail)?.url() || "/placeholder.svg"}
                        alt={project.title}
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
                    href={`/projects/${project.slug.current}`}
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
