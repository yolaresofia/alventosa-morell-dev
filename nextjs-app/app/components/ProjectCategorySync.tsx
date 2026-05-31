"use client";

import { useEffect } from "react";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";

type Props = {
  /** Category of the currently viewed project. Synced into the global category context so the filter persists when navigating back to /projects. */
  category: string | null | undefined;
};

/**
 * Tiny client island that mirrors the current project's category into the
 * global ProjectCategoryContext. Lifted out of ProjectPageContent so the rest
 * of the project page can stay server-rendered.
 */
export default function ProjectCategorySync({ category }: Props) {
  const { setCategory } = useProjectCategory();

  useEffect(() => {
    if (category) setCategory(category as any);
  }, [category, setCategory]);

  return null;
}
