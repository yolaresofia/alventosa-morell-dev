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
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const [currentSlug, setCurrentSlug] = useState<string | null>(
    projects.length > 0 && projects[0] ? projects[0].slug?.current : null,
  )
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window === "undefined") return true
    return sessionStorage.getItem("welcomeAnimationShown") !== "true"
  })
  const [overlayOpacity, setOverlayOpacity] = useState(isFirstLoad ? 1 : 0)
  const [animationComplete, setAnimationComplete] = useState(!isFirstLoad)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const scrollCooldownRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const COOLDOWN_DURATION = 800 // Adjust this value if needed (e.g., 1000, 1200)

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
      if (style.parentNode) style.parentNode.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (pathname !== "/" || !isFirstLoad) {
      setAnimationComplete(true)
      setOverlayOpacity(0)
      return
    }
    const timer = setTimeout(() => {
      setAnimationComplete(true)
      sessionStorage.setItem("welcomeAnimationShown", "true")
      setTimeout(() => setOverlayOpacity(0), 20)
    }, 1000)
    return () => clearTimeout(timer)
  }, [pathname, isFirstLoad])

  useEffect(() => {
    if (!isLargeDesktop || !projects.length || !containerRef.current || !animationComplete) return
    const project = projects[activeIndex]
    if (project?.slug?.current) {
      setCurrentSlug(project.slug.current)
      const element = containerRef.current.querySelector(`[data-slug="${project.slug.current}"]`)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          // --- ALIGNMENT CHANGE ---
          // Changed from "center" back to "start" as requested.
          inline: "start",
          block: "nearest",
        })
      }
    }
  }, [activeIndex, isLargeDesktop, projects, animationComplete, containerRef])

  useEffect(() => {
    if (!isLargeDesktop || !projects.length || !sectionRef.current || !animationComplete) {
      return
    }
    const currentSectionRef = sectionRef.current
    const handleWheelScroll = (event: WheelEvent) => {
      if (!currentSectionRef.contains(event.target as Node)) return
      event.preventDefault()
      if (scrollCooldownRef.current) return
      const currentActiveIndexVal = activeIndexRef.current
      let newIndex = currentActiveIndexVal
      const scrollThreshold = 1
      if (event.deltaY > scrollThreshold && currentActiveIndexVal < projects.length - 1) {
        newIndex = currentActiveIndexVal + 1
      } else if (event.deltaY < -scrollThreshold && currentActiveIndexVal > 0) {
        newIndex = currentActiveIndexVal - 1
      }
      if (newIndex !== currentActiveIndexVal) {
        scrollCooldownRef.current = true
        setActiveIndex(newIndex)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => {
          scrollCooldownRef.current = false
        }, COOLDOWN_DURATION)
      }
    }
    currentSectionRef.addEventListener("wheel", handleWheelScroll, { passive: false })
    return () => {
      currentSectionRef.removeEventListener("wheel", handleWheelScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [isLargeDesktop, projects, animationComplete, sectionRef, homepage?.featuredProjects])

  useEffect(() => {
    if (!isLargeDesktop || !projects.length || !animationComplete) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (scrollCooldownRef.current) return
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      event.preventDefault()
      const currentActiveIndexVal = activeIndexRef.current
      let newIndex = currentActiveIndexVal
      const direction = event.key === "ArrowRight" ? 1 : -1
      if (direction === 1 && currentActiveIndexVal < projects.length - 1) {
        newIndex = currentActiveIndexVal + 1
      } else if (direction === -1 && currentActiveIndexVal > 0) {
        newIndex = currentActiveIndexVal - 1
      }
      if (newIndex !== currentActiveIndexVal) {
        scrollCooldownRef.current = true
        setActiveIndex(newIndex)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => {
          scrollCooldownRef.current = false
        }, COOLDOWN_DURATION)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [isLargeDesktop, projects, animationComplete, homepage?.featuredProjects])

  if (!projects.length) return <div>No featured projects</div>

  return (
    <section
      ref={sectionRef}
      className={`w-full ${isLargeDesktop ? "h-[90vh] overflow-hidden" : "h-auto"} relative`}
      tabIndex={isLargeDesktop ? -1 : undefined}
    >
      <div className="w-full h-full flex flex-col overflow-hidden z-10">
        <div
          ref={containerRef}
          className={`flex pt-0 ${isLargeDesktop ? "scroll-smooth" : ""} overflow-x-hidden overflow-y-hidden w-full h-full`}
        >
          {projects.map((project: any, index: number) => {
            const desktopImageUrl = project.featuredImage ? urlForImage(project.featuredImage)?.url() : null
            const mobileImageUrl = project.mobileFeaturedImage ? urlForImage(project.mobileFeaturedImage)?.url() : null
            const slug = project.slug?.current
            if (!slug || (!desktopImageUrl && !mobileImageUrl)) return null
            const isFocused = currentSlug === slug
            const imageToUse =
              (isDesktop ? desktopImageUrl : mobileImageUrl || desktopImageUrl) ??
              `/placeholder.svg?width=1000&height=1500&query=project+image+${index}`
            const imageClass = isDesktop ? "h-[85vh] w-auto" : "h-[85vh] w-screen"
            return (
              <Link
                href={`/projects/${slug}`}
                key={slug}
                data-slug={slug}
                className="flex-shrink-0 flex flex-col items-start"
                style={{
                  opacity: isLargeDesktop && isFocused ? 1 : isLargeDesktop ? 0.2 : 1,
                  transition: isLargeDesktop ? "opacity 0.3s ease" : "none",
                  width: isLargeDesktop ? "auto" : "100vw",
                  // --- ALIGNMENT CHANGE ---
                  // Changed from "center" back to "start" to match scrollIntoView.
                  scrollSnapAlign: isLargeDesktop ? "start" : "none",
                }}
                draggable="false"
              >
                <div className={imageClass}>
                  <Image
                    src={imageToUse || "/placeholder.svg"}
                    alt={project.title || `Featured Project ${index + 1}`}
                    width={isDesktop ? 1000 : 500}
                    height={isDesktop ? 1500 : 800}
                    className={`object-cover ${imageClass}`}
                    priority={index < 2}
                    unoptimized
                    draggable="false"
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
            src={logoUrl || "/placeholder.svg?width=600&height=200&query=company+logo"}
            alt="Company Logo"
            className="w-[80%] max-w-[600px] h-auto object-contain mix-blend-multiply"
          />
        </div>
      )}
    </section>
  )
}
