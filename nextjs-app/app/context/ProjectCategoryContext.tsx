"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type ProjectCategory = "all" | "uni" | "pluri" | "equip";

const ProjectCategoryContext = createContext<{
  category: ProjectCategory;
  setCategory: (category: ProjectCategory) => void;
}>({
  category: "all",
  setCategory: () => {},
});

export function ProjectCategoryProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const urlCategory = (searchParams.get("cat") || "all") as ProjectCategory;
  const [category, setCategory] = useState<ProjectCategory>(urlCategory);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </ProjectCategoryContext.Provider>
  );
}

export const useProjectCategory = () => useContext(ProjectCategoryContext);
