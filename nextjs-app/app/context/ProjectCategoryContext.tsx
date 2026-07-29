"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useLocale } from "@/app/i18n/client"

type ProjectCategory = "all" | "uni" | "pluri" | "equip"

const VALID_CATEGORIES: ProjectCategory[] = ["all", "uni", "pluri", "equip"]

const ProjectCategoryContext = createContext<{
  category: ProjectCategory
  setCategory: (category: ProjectCategory) => void
}>({
  category: "all",
  setCategory: () => {},
})

/** True only on the projects listing route (any locale). Excludes nested routes like /[lang]/projects/[slug] and /[lang]/projects/index. */
function isProjectsListingPath(pathname: string): boolean {
  // Matches "/ca/projects", "/es/projects", "/en/projects" exactly.
  return /^\/[a-z]{2}\/projects\/?$/i.test(pathname)
}

function ClientOnly({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <>{children}</>
}

function CategoryConsumer({
  onCategoryChange,
}: {
  onCategoryChange: (category: ProjectCategory) => void
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    if (!isProjectsListingPath(pathname)) return

    const queryCat = searchParams.get("cat")
    if (VALID_CATEGORIES.includes(queryCat as ProjectCategory)) {
      onCategoryChange(queryCat as ProjectCategory)
    } else {
      onCategoryChange("all")
    }
  }, [searchParams, pathname, onCategoryChange])

  return null
}

export function ProjectCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all")
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleSetCategory = (newCategory: ProjectCategory) => {
    setCategory(newCategory)
    if (!isProjectsListingPath(pathname)) return

    const params = new URLSearchParams(window.location.search)
    if (newCategory === "all") {
      params.delete("cat")
    } else {
      params.set("cat", newCategory)
    }

    const query = params.toString()
    const basePath = `/${locale}/projects`
    router.push(query ? `${basePath}?${query}` : basePath)
  }

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory: handleSetCategory }}>
      <ClientOnly>
        <Suspense fallback={null}>
          <CategoryConsumer onCategoryChange={setCategory} />
        </Suspense>
      </ClientOnly>
      {children}
    </ProjectCategoryContext.Provider>
  )
}

export const useProjectCategory = () => useContext(ProjectCategoryContext)
