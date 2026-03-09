"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"
import type { GetProjectsGridQueryResult } from "@/sanity.types"
import { useProjectCategory } from "@/app/context/ProjectCategoryContext"
import { useLanguage } from "@/app/context/LanguageContext"
import { getTranslation } from "@/app/utils/translations"

export function ProjectsGrid({ projects }: { projects: GetProjectsGridQueryResult }) {
  const { category } = useProjectCategory()
  const { language } = useLanguage()
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const filteredProjects = projects
    .filter((project) => category === "all" || project.category === category)
    .filter((project) => !!project.thumbnail)
    .filter((project) => !project.notClickableInIndex)
    .sort((a, b) => {
      const yearA = Number.parseInt(a.projectInfo?.year?.value || "0", 10)
      const yearB = Number.parseInt(b.projectInfo?.year?.value || "0", 10)
    
      if (yearA !== yearB) {
        return yearB - yearA
      }
    
      const numA = Number(a.projectNumber) || 0
      const numB = Number(b.projectNumber) || 0
      return numB - numA 
    })

  const firstProjectSlug = filteredProjects[0]?.slug.current || null

  const handleMouseEnter = (slug: string) => {
    setHasInteracted(true)
    setHoveredSlug(slug)
  }

  const handleMouseLeave = () => {
    setHoveredSlug(null)
  }

  // When the category changes, reset interaction
  useEffect(() => {
    setHasInteracted(false)
    setHoveredSlug(null)
  }, [category])

  const activeSlug = hasInteracted ? hoveredSlug : firstProjectSlug

  return (
    <section className="relative w-full min-h-screen px-16 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-16">
        {filteredProjects.map((project) => {
          const thumbnailImage = project.thumbnail
          if (!thumbnailImage) return null

          const imageUrl = urlForImage(thumbnailImage)?.url()
          const isActive = activeSlug === project.slug.current
          const imageOpacity = isActive ? "lg:opacity-100" : "lg:opacity-20"
          const titleOpacity = isActive ? "lg:opacity-100" : "lg:opacity-0"
          const altFromSanity = getTranslation(thumbnailImage.altText, language)
          const imageAlt = altFromSanity || project.title || "Project thumbnail"

          return (
            <Link
              href={`/projects/${project.slug.current}`}
              key={project.slug.current}
              onMouseEnter={() => handleMouseEnter(project.slug.current)}
              onMouseLeave={handleMouseLeave}
              className="flex flex-col items-start transition-opacity duration-300"
            >
              <div className={`relative w-full aspect-[3/4] transition-opacity duration-300 ${imageOpacity}`}>
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
                className={`mt-2 min-h-[24px] text-sm monitor:text-xl font-medium leading-tight transition-opacity duration-300 ${titleOpacity}`}
              >
                <div className="flex lg:hidden">
                  <div className="pr-2">{project.projectNumber || "-"}</div>
                  <div>{project.title}</div>
                </div>
                {isActive && (
                  <div className="hidden lg:flex">
                    <div className="pr-2">{project.projectNumber || "-"}</div>
                    <div>{project.title}</div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
