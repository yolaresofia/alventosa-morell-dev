/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"

type Props = {
  homepage: any
  logoUrl: string | null
}

export default function HomePageClient({ homepage, logoUrl }: Props) {
  const pathname = usePathname()
  const projects = homepage?.featuredProjects || []
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const checkSizes = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 768)
      setIsLargeDesktop(width >= 1024)
    }

    checkSizes()
    window.addEventListener("resize", checkSizes)
    return () => window.removeEventListener("resize", checkSizes)
  }, [])

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
    `
    document.head.appendChild(style)

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  useEffect(() => {
    if (pathname !== "/") return

    setOverlayOpacity(1)
    setAnimationComplete(false)

    const timer = setTimeout(() => {
      setAnimationComplete(true)
      setTimeout(() => {
        setOverlayOpacity(0)
      }, 20)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!isLargeDesktop) return

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
  }, [animationComplete, isLargeDesktop])

  useEffect(() => {
    if (!isLargeDesktop) return

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
      }
    )

    const elements = containerRef.current?.querySelectorAll("[data-slug]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [projects, isLargeDesktop])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
  }, [])

  // ⌨️ Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLargeDesktop || !projects.length) return
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return

      const currentIndex = projects.findIndex((p: { slug?: { current?: string } }) => p.slug?.current === currentSlug)

      const nextIndex =
        event.key === "ArrowRight"
          ? Math.min(projects.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1)

      const nextProject = projects[nextIndex]
      if (!nextProject) return

      const nextEl = containerRef.current?.querySelector(`[data-slug="${nextProject.slug?.current}"]`)
      if (nextEl instanceof HTMLElement) {
        nextEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
        setCurrentSlug(nextProject.slug?.current)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLargeDesktop, projects, currentSlug])

  if (!projects.length) return <div>No featured projects</div>

  return (
    <section ref={sectionRef} className={`w-full ${isLargeDesktop ? "h-[200vh]" : "h-auto"} relative`}>
      <div className={`${isLargeDesktop ? "sticky top-0" : ""} left-0 w-full h-[90vh] flex flex-col overflow-hidden z-10`}>
        <div
          ref={containerRef}
          className={`flex pt-0 ${isLargeDesktop ? "snap-x snap-mandatory scroll-smooth" : ""} overflow-x-auto overflow-y-hidden w-full h-full`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project: any) => {
            const desktopImageUrl = project.featuredImage ? urlForImage(project.featuredImage)?.url() : null
            const mobileImageUrl = project.mobileFeaturedImage ? urlForImage(project.mobileFeaturedImage)?.url() : null
            const slug = project.slug?.current
            if (!slug || (!desktopImageUrl && !mobileImageUrl)) return null

            const isFocused = currentSlug === slug
            const imageToUse = (isDesktop ? desktopImageUrl : mobileImageUrl || desktopImageUrl) ?? "/placeholder.svg"
            const imageClass = isDesktop ? "h-[85vh] w-auto" : "h-[85vh] w-screen"

            return (
              <Link
                href={`/projects/${slug}`}
                key={slug}
                data-slug={slug}
                className={`${isLargeDesktop ? "snap-start" : ""} flex-shrink-0 flex flex-col items-start`}
                style={{
                  opacity: isLargeDesktop && isFocused ? 1 : isLargeDesktop ? 0.2 : 1,
                  transition: isLargeDesktop && scrollProgress > 0.2 ? "opacity 0.3s ease" : "none",
                }}
              >
                <div className={imageClass}>
                  <Image
                    src={imageToUse}
                    alt={project.title}
                    width={isDesktop ? 1000 : 500}
                    height={isDesktop ? 1500 : 800}
                    className={`object-cover ${imageClass}`}
                    unoptimized
                  />
                </div>
                <div className="mt-2 text-base monitor:text-xl pl-4 font-medium leading-tight flex">
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
          transition: animationComplete ? "opacity 0.8s ease-out" : "none",
        }}
      />

      {logoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            opacity: overlayOpacity,
            transition: animationComplete ? "opacity 0.5s ease-out" : "none",
          }}
        >
          <img
            src={logoUrl}
            alt="Alventosa Morell Arquitectes"
            className="w-[80%] max-w-[600px] h-auto object-contain mix-blend-multiply"
          />
        </div>
      )}
    </section>
  )
}
