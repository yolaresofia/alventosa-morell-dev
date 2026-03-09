/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"
import { useLanguage } from "@/app/context/LanguageContext"
import { getTranslation, LocalizedField } from "@/app/utils/translations"

type Props = {
  homepage: any
  logoUrl: string | null
  logoAltText?: LocalizedField | null
}

const easeInOutCubic = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t * t + b
  t -= 2
  return (c / 2) * (t * t * t + 2) + b
}

const CUSTOM_ANIMATION_DURATION = 600

export default function HomePageClient({ homepage, logoUrl, logoAltText }: Props) {
  const pathname = usePathname()
  const projects = useMemo(() => homepage?.featuredProjects || [], [homepage?.featuredProjects])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(activeIndex)
  const { language } = useLanguage()
  const logoAlt = getTranslation(logoAltText || undefined, language) || "Alventosa Morell Arquitectes"

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const currentSlug = projects[activeIndex]?.slug?.current ?? null
  const [isDesktop, setIsDesktop] = useState(false) // True for >= 768px
  const [isLargeDesktop, setIsLargeDesktop] = useState(false) // True for >= 1024px

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

  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window === "undefined") return true
    return sessionStorage.getItem("welcomeAnimationShown") !== "true"
  })
  const [overlayOpacity, setOverlayOpacity] = useState(isFirstLoad ? 1 : 0)
  const [animationComplete, setAnimationComplete] = useState(!isFirstLoad)

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  const scrollCooldownRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const COOLDOWN_DURATION = CUSTOM_ANIMATION_DURATION + 150

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
    const shouldPlayAnimation = isLargeDesktop && pathname === "/" && isFirstLoad
    if (shouldPlayAnimation) {
      requestAnimationFrame(() => {
        setOverlayOpacity(1)
        setAnimationComplete(false)
      })
      const timer = setTimeout(() => {
        setAnimationComplete(true)
        sessionStorage.setItem("welcomeAnimationShown", "true")
        setTimeout(() => setOverlayOpacity(0), 20)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      requestAnimationFrame(() => {
        setOverlayOpacity(0)
        setAnimationComplete(true)
      })
    }
  }, [pathname, isFirstLoad, isLargeDesktop])

  useEffect(() => {
    if (!isLargeDesktop || !projects.length || !containerRef.current || !animationComplete) return

    const project = projects[activeIndex]
    if (!project?.slug?.current) return

    const targetElement = containerRef.current.querySelector<HTMLElement>(`[data-slug="${project.slug.current}"]`)

    if (targetElement && containerRef.current) {
      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()
      const startScrollLeft = container.scrollLeft
      const targetScrollLeft = targetRect.left - containerRect.left + container.scrollLeft

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }

      let startTime: number | null = null
      const animateScroll = (timestamp: number) => {
        if (!containerRef.current) return
        if (!startTime) startTime = timestamp
        const elapsedTime = timestamp - startTime
        const newScrollLeft = easeInOutCubic(
          elapsedTime,
          startScrollLeft,
          targetScrollLeft - startScrollLeft,
          CUSTOM_ANIMATION_DURATION,
        )
        containerRef.current.scrollLeft = newScrollLeft
        if (elapsedTime < CUSTOM_ANIMATION_DURATION) {
          animationFrameIdRef.current = requestAnimationFrame(animateScroll)
        } else {
          containerRef.current.scrollLeft = targetScrollLeft
          animationFrameIdRef.current = null
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(animateScroll)
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [activeIndex, isLargeDesktop, projects, animationComplete])

  useEffect(() => {
    if (!isLargeDesktop || !projects.length || !sectionRef.current || !animationComplete) return
    const currentSectionRef = sectionRef.current
    const handleWheelScroll = (event: WheelEvent) => {
      if (!currentSectionRef.contains(event.target as Node)) return
      event.preventDefault()
      if (scrollCooldownRef.current) return
      const currentActiveIndexVal = activeIndexRef.current
      let newIndex = currentActiveIndexVal
      if (event.deltaY > 1 && currentActiveIndexVal < projects.length - 1) {
        newIndex = currentActiveIndexVal + 1
      } else if (event.deltaY < -1 && currentActiveIndexVal > 0) {
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

  // Effect to hide mobile browser URL bar
  useEffect(() => {
    // Target mobile devices (screen width < 768px based on your isDesktop state)
    // and ensure initial setup/animations are complete.
    if (typeof window !== "undefined" && !isDesktop && animationComplete) {
      // A short delay can help ensure the browser is ready and layout is stable.
      const timer = setTimeout(() => {
        window.scrollTo(0, 1)
      }, 100) // 100ms delay, adjust if needed

      return () => clearTimeout(timer)
    }
  }, [isDesktop, animationComplete]) // Re-run if isDesktop or animationComplete changes

  if (!projects.length) return <div>No featured projects</div>

  const containerClasses = `flex pt-0 w-full h-full ${
    isLargeDesktop ? "overflow-x-hidden" : "snap-x snap-mandatory scroll-smooth overflow-x-auto"
  }`

  return (
    <section
      ref={sectionRef}
      className={`w-full ${isLargeDesktop ? "h-[90vh] overflow-hidden" : "h-auto"} relative`}
      tabIndex={isLargeDesktop ? -1 : undefined}
    >
      <div className="w-full h-full flex flex-col overflow-hidden z-10">
        <div ref={containerRef} className={containerClasses}>
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
            const featuredAltRaw = getTranslation(project.featuredImage?.altText, language)
            const mobileAltRaw = getTranslation(project.mobileFeaturedImage?.altText, language)
            const fallbackAlt = project.title || `Projecte destacat ${index + 1}`
            const imageAlt =
              (isDesktop ? featuredAltRaw : mobileAltRaw) || featuredAltRaw || mobileAltRaw || fallbackAlt
            return (
              <Link
                href={`/projects/${slug}`}
                key={slug}
                data-slug={slug}
                className="flex-shrink-0 flex flex-col items-start"
                style={{
                  opacity: isLargeDesktop ? (isFocused ? 1 : 0.2) : 1,
                  transition: isLargeDesktop ? "opacity 0.3s ease" : "none",
                  scrollSnapAlign: isLargeDesktop ? "none" : "start",
                }}
                draggable="false"
              >
                <div className={imageClass}>
                  <Image
                    src={imageToUse || "/placeholder.svg"}
                    alt={imageAlt}
                    width={isDesktop ? 1000 : 500}
                    height={isDesktop ? 1500 : 800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover ${imageClass}`}
                    priority={index < 2}
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
      {isLargeDesktop && (
        <>
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
                alt={logoAlt}
                className="w-[80%] max-w-[600px] h-auto object-contain mix-blend-multiply"
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}
