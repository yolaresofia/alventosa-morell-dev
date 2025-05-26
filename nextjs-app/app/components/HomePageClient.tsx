/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"

type Props = {
  homepage: any
  logoUrl: string | null
}

export default function HomePageClient({ homepage, logoUrl }: Props) {
  const projects = homepage?.featuredProjects || []
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const startAnimation = () => {
      setTimeout(() => {
        setAnimationComplete(true)
        setTimeout(() => setOverlayOpacity(0), 20)
      }, 500)
    }
    const timer = setTimeout(startAnimation, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current
        const container = containerRef.current

        if (!section || !container || !animationComplete) return

        const sectionRect = section.getBoundingClientRect()
        const sectionTop = sectionRect.top
        const sectionHeight = sectionRect.height
        const viewportHeight = window.innerHeight

        let progress = 0
        if (sectionTop <= 0) {
          progress = Math.min(Math.abs(sectionTop) / (sectionHeight - viewportHeight), 1)
        }

        setScrollProgress(progress)

        const scrollDelay = 0.25
        if (progress <= scrollDelay) {
          container.scrollLeft = 0
        } else {
          const adjustedScrollProgress = (progress - scrollDelay) / (1 - scrollDelay)
          const maxScroll = container.scrollWidth - container.clientWidth
          container.scrollLeft = adjustedScrollProgress * maxScroll
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [animationComplete])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target) {
          const slug = visible.target.getAttribute("data-slug")
          if (slug) setCurrentSlug(slug)
        }
      },
      {
        root: containerRef.current,
        threshold: 0.9,
      },
    )

    const elements = containerRef.current?.querySelectorAll("[data-slug]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [projects])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
  }, [])

  if (!projects.length) return <div>No featured projects</div>

  return (
    <section ref={sectionRef} className="w-full h-[200vh] relative">
      <div className="sticky top-0 left-0 w-full h-[90vh] flex flex-col overflow-hidden z-10">
        <div
          ref={containerRef}
          className="flex pt-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden w-full h-full scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {projects.map((project: any) => {
            const imageUrl = project.featuredImage ? urlForImage(project.featuredImage)?.url() : null
            const slug = project.slug?.current
            if (!slug || !imageUrl) return null

            const isFocused = currentSlug === slug

            return (
              <Link
                href={`/projects/${slug}`}
                key={slug}
                data-slug={slug}
                className="snap-start flex-shrink-0 flex flex-col items-start"
                style={{
                  opacity: isFocused ? 1 : 0.2,
                  transition: scrollProgress > 0.2 ? "opacity 0.3s ease" : "none",
                }}
              >
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
                <div className="mt-2 text-sm pl-4 font-medium leading-tight flex">
                  <div className="pr-3">{project.projectNumber}</div>
                  <div>{project.title}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div
        className="fixed inset-0 bg-white z-40 pointer-events-none"
        style={{
          opacity: overlayOpacity * 0.85,
          transition: animationComplete ? "opacity 0.6s ease-out" : "none", // Reduced to half (0.6s)
        }}
      />
      {logoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            opacity: overlayOpacity,
            transition: animationComplete ? "opacity 0.6s ease-out" : "none", // Reduced to half (0.6s)
          }}
        >
          <img
            src={logoUrl || "/placeholder.svg"}
            alt="Alventosa Morell Arquitectes"
            className="w-[600px] h-auto object-contain mix-blend-multiply"
          />
        </div>
      )}
    </section>
  )
}
