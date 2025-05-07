"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"

export default function HomePageClient({ homepage }: { homepage: any }) {
  const projects = homepage?.featuredProjects || []
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current

    if (!section || !container) return

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect()
      const sectionTop = sectionRect.top
      const sectionHeight = sectionRect.height
      const viewportHeight = window.innerHeight

      let scrollProgress = 0

      if (sectionTop <= 0) {
        scrollProgress = Math.min(Math.abs(sectionTop) / (sectionHeight - viewportHeight), 1)
      }

      const maxScroll = container.scrollWidth - container.clientWidth
      const targetScrollLeft = scrollProgress * maxScroll
      container.scrollLeft = targetScrollLeft
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target) {
          const slug = visible.target.getAttribute("data-slug")
          if (slug) setCurrentSlug(slug)
        }
      },
      { root: containerRef.current, threshold: 0.6 },
    )

    const elements = containerRef.current?.querySelectorAll("[data-slug]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [projects])

  if (!projects.length) return <div>No featured projects</div>

  return (
    <section ref={sectionRef} className="w-full h-[300vh] relative">
      {/* The sticky container that holds everything */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col overflow-hidden">
        {/* The scrollable container with images that starts from the top */}
        <div className="flex overflow-x-hidden scrollbar-hide pt-0" ref={containerRef}>
          {projects.map((project: any) => {
            const imageUrl = project.featuredImage ? urlForImage(project.featuredImage)?.url() : null
            const slug = project.slug?.current

            if (!slug || !imageUrl) return null

            const isFocused = hoveredSlug === slug || currentSlug === slug

            return (
              <Link
                href={`/projects/${slug}`}
                key={slug}
                data-slug={slug}
                onMouseEnter={() => setHoveredSlug(slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className="snap-center flex-shrink-0 flex flex-col items-start transition-opacity duration-300"
                style={{
                  opacity: isFocused ? 1 : 0.2,
                }}
              >
                {/* Image container that reaches the top but is not full height */}
                <div className="h-[85vh] w-auto">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    width={1000}
                    height={1500}
                    className="h-[85vh] w-auto object-cover"
                    unoptimized
                  />
                </div>
                {/* Project title and number below the image */}
                <div className="mt-2 text-sm pl-4 font-medium leading-tight flex">
                  <div className="pr-3">{project.projectNumber}</div>
                  <div>{project.title}</div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
