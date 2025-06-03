"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

type ProjectCategory = "all" | "uni" | "pluri" | "equip"

const VALID_CATEGORIES: ProjectCategory[] = ["all", "uni", "pluri", "equip"]

const ProjectCategoryContext = createContext<{
  category: ProjectCategory
  setCategory: (category: ProjectCategory) => void
}>({
  category: "all",
  setCategory: () => {},
})

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
    if (pathname === "/projects") {
      const queryCat = searchParams.get("cat")

      if (VALID_CATEGORIES.includes(queryCat as ProjectCategory)) {
        onCategoryChange(queryCat as ProjectCategory)
      } else {
        onCategoryChange("all")
      }
    }
  }, [searchParams, pathname, onCategoryChange])

  return null
}

export function ProjectCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all")
  const router = useRouter()
  const pathname = usePathname()

  const handleSetCategory = (newCategory: ProjectCategory) => {
    setCategory(newCategory)
    if (pathname === "/projects") {
      const params = new URLSearchParams(window.location.search)

      if (newCategory === "all") {
        params.delete("cat")
      } else {
        params.set("cat", newCategory)
      }

      const newQuery = params.toString()
      const newPath = newQuery ? `/projects?${newQuery}` : "/projects"

      router.push(newPath)
    }
  }

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory: handleSetCategory }}>
      <ClientOnly>
        <Suspense fallback={null}>
          <CategoryConsumer onCategoryChange={setCategory} />
        </Suspense>
        {children}
      </ClientOnly>
    </ProjectCategoryContext.Provider>
  )
}

export const useProjectCategory = () => useContext(ProjectCategoryContext)
