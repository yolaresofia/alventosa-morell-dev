"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type ProjectCategory = "all" | "uni" | "pluri" | "equip";

const VALID_CATEGORIES: ProjectCategory[] = ["all", "uni", "pluri", "equip"];

const ProjectCategoryContext = createContext<{
  category: ProjectCategory;
  setCategory: (category: ProjectCategory) => void;
}>({
  category: "all",
  setCategory: () => {},
});

export function ProjectCategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all");
  const searchParams = useSearchParams();
  const queryCat = searchParams.get("cat");

  useEffect(() => {
    const newCategory = VALID_CATEGORIES.includes(queryCat as ProjectCategory)
      ? (queryCat as ProjectCategory)
      : "all";

    setCategory(newCategory);
  }, [queryCat]);

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </ProjectCategoryContext.Provider>
  );
}

export const useProjectCategory = () => useContext(ProjectCategoryContext);
