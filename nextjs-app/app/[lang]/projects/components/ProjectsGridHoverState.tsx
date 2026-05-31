"use client";

import { useEffect } from "react";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";

type Props = {
  /** Slug to highlight before the user has interacted (usually the first project). */
  defaultActiveSlug: string | null;
};

/**
 * Wires up the desktop hover dimming on the projects grid. The grid itself is
 * rendered server-side; this island only toggles opacity classes via a
 * data attribute on the container so the hover behavior costs near-zero JS
 * and the initial HTML stays intact.
 *
 * Behavior:
 * - On mount, marks the default slug as active (so the first card is highlighted before any hover).
 * - On mouseenter of a card, switches the active slug to the hovered one.
 * - On mouseleave of the grid, returns to the default slug.
 * - When the category changes (via context), resets to the new default.
 */
export default function ProjectsGridHoverState({ defaultActiveSlug }: Props) {
  const { category } = useProjectCategory();

  useEffect(() => {
    const grid = document.querySelector<HTMLElement>("[data-projects-grid]");
    if (!grid) return;

    const apply = (slug: string | null) => {
      grid.querySelectorAll<HTMLElement>("[data-project-card]").forEach((card) => {
        const isActive = !!slug && card.dataset.slug === slug;
        const image = card.querySelector<HTMLElement>("[data-project-image]");
        const title = card.querySelector<HTMLElement>("[data-project-title]");
        if (image) {
          image.classList.toggle("lg:opacity-100", isActive);
          image.classList.toggle("lg:opacity-20", !isActive);
        }
        if (title) {
          title.classList.toggle("lg:opacity-100", isActive);
          title.classList.toggle("lg:opacity-0", !isActive);
        }
      });
    };

    apply(defaultActiveSlug);

    const onEnter = (event: Event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-project-card]");
      if (target?.dataset.slug) apply(target.dataset.slug);
    };
    const onLeave = () => apply(defaultActiveSlug);

    const cards = grid.querySelectorAll<HTMLElement>("[data-project-card]");
    cards.forEach((card) => card.addEventListener("mouseenter", onEnter));
    grid.addEventListener("mouseleave", onLeave);

    return () => {
      cards.forEach((card) => card.removeEventListener("mouseenter", onEnter));
      grid.removeEventListener("mouseleave", onLeave);
    };
  }, [defaultActiveSlug, category]);

  return null;
}
