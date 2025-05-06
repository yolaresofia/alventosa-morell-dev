// app/context/ProjectCategoryContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

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

  return (
    <ProjectCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </ProjectCategoryContext.Provider>
  );
}

export const useProjectCategory = () => useContext(ProjectCategoryContext);
