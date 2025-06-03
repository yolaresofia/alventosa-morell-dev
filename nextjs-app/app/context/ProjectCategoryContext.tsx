"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type ProjectCategory = "all" | "uni" | "pluri" | "equip"

const VALID_CATEGORIES: ProjectCategory[] = ["all", "uni", "pluri", "equip"]

const LOCAL_STORAGE_KEY = "selectedProjectCategory"

const ProjectCategoryContext = createContext<{
  category: ProjectCategory
  setCategory: (category: ProjectCategory) => void
}>({
  category: "all",
  setCategory: () => {},
})

// Client-side only component that safely uses browser APIs
function ClientOnly({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <>{children}</>
}

export function ProjectCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Effect to initialize from localStorage and URL
  useEffect(() => {
    // Try to get from localStorage first
    const savedCategory =
      typeof window !== "undefined" ? (localStorage.getItem(LOCAL_STORAGE_KEY) as ProjectCategory) : null

    // Then check URL query parameter
    const queryCat = searchParams.get("cat")

    // Determine which category to use (URL has priority over localStorage)
    let newCategory: ProjectCategory = "all"

    if (VALID_CATEGORIES.includes(queryCat as ProjectCategory)) {
      newCategory = queryCat as ProjectCategory
    } else if (VALID_CATEGORIES.includes(savedCategory as ProjectCategory)) {
      newCategory = savedCategory as ProjectCategory
    }

    // Update state
    setCategory(newCategory)

    // Save to localStorage for persistence
    if (typeof window !== "undefined" && newCategory) {
      localStorage.setItem(LOCAL_STORAGE_KEY, newCategory)
    }
  }, [searchParams])

  // Custom setCategory function that updates URL and localStorage
  const handleSetCategory = (newCategory: ProjectCategory) => {
    // Update state
    setCategory(newCategory)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, newCategory)
    }

    // Only update URL if we're on the projects page
    if (pathname === "/projects") {
      const params = new URLSearchParams(searchParams.toString())

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
      <ClientOnly>{children}</ClientOnly>
    </ProjectCategoryContext.Provider>
  )
}

export const useProjectCategory = () => useContext(ProjectCategoryContext)
