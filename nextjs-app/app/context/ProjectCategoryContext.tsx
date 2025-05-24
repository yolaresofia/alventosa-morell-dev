"use client";

import { createContext, useContext, useState, useEffect } from "react";

type ProjectCategory = "all" | "uni" | "pluri" | "equip";

const ProjectCategoryContext = createContext<{
  category: ProjectCategory;
  setCategory: (category: ProjectCategory) => void;
}>({
  category: "all",
  setCategory: () => {},
});

export function ProjectCategoryProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<ProjectCategory>("all");

  useEffect(() => {
    // This only runs on client
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat") as ProjectCategory;
    if (cat && ["uni", "pluri", "equip"].includes(cat)) {
      setCategory(cat);
    } else {
      setCategory("all");
    }
  }, []);

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </ProjectCategoryContext.Provider>
  );
}

export const useProjectCategory = () => useContext(ProjectCategoryContext);
