"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, Suspense } from "react"
import { useSearchParams } from "next/navigation"

type ProjectCategory = "all" | "uni" | "pluri" | "equip"

const VALID_CATEGORIES: ProjectCategory[] = ["all", "uni", "pluri", "equip"]

const ProjectCategoryContext = createContext<{
  category: ProjectCategory
  setCategory: (category: ProjectCategory) => void
}>({
  category: "all",
  setCategory: () => {},
})

// This component uses useSearchParams and will be wrapped in Suspense
function ProjectCategoryConsumer({ children }: { children: ReactNode }) {
  const { setCategory } = useContext(ProjectCategoryContext)
  const searchParams = useSearchParams()
  const queryCat = searchParams.get("cat")

  useEffect(() => {
    const newCategory = VALID_CATEGORIES.includes(queryCat as ProjectCategory) ? (queryCat as ProjectCategory) : "all"

    setCategory(newCategory)
  }, [queryCat])

  return <>{children}</>
}

export function ProjectCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all")

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory }}>
      <Suspense fallback={<>{children}</>}>
        <ProjectCategoryConsumer>{children}</ProjectCategoryConsumer>
      </Suspense>
    </ProjectCategoryContext.Provider>
  )
}

export const useProjectCategory = () => useContext(ProjectCategoryContext)
