"use client";

import { useEffect } from "react";

/**
 * Wires up the desktop hover-to-expand behavior on the projects index table.
 * The table itself is server-rendered; this island toggles inline styles on
 * the thumbnail wrappers and a data-active flag on the row content via DOM
 * mutations so the hover interaction costs near-zero JS and the initial HTML
 * stays intact.
 */
export default function ProjectsIndexHoverState() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-projects-index]");
    if (!root) return;

    const expand = (row: HTMLElement) => {
      const wrapper = row.querySelector<HTMLElement>("[data-project-thumbnail-wrapper]");
      const inner = row.querySelector<HTMLElement>("[data-project-thumbnail-inner]");
      const content = row.querySelector<HTMLElement>("[data-project-row-content]");
      content?.setAttribute("data-active", "true");
      if (wrapper) wrapper.style.height = "300px";
      if (inner) {
        inner.style.opacity = "1";
        inner.style.transform = "translateY(0)";
        inner.style.transition = "opacity 0.25s ease-out 0.4s, transform 0.25s ease-out 0.4s";
      }
    };

    const collapse = (row: HTMLElement) => {
      const wrapper = row.querySelector<HTMLElement>("[data-project-thumbnail-wrapper]");
      const inner = row.querySelector<HTMLElement>("[data-project-thumbnail-inner]");
      const content = row.querySelector<HTMLElement>("[data-project-row-content]");
      content?.setAttribute("data-active", "false");
      if (wrapper) wrapper.style.height = "0px";
      if (inner) {
        inner.style.opacity = "0";
        inner.style.transform = "translateY(10px)";
        inner.style.transition = "opacity 0.15s ease-out, transform 0.15s ease-out";
      }
    };

    const onEnter = (event: Event) => {
      const row = (event.currentTarget as HTMLElement);
      expand(row);
    };
    const onLeave = (event: Event) => {
      const row = (event.currentTarget as HTMLElement);
      collapse(row);
    };

    const rows = root.querySelectorAll<HTMLElement>("[data-project-row]");
    rows.forEach((row) => {
      row.addEventListener("mouseenter", onEnter);
      row.addEventListener("mouseleave", onLeave);
    });

    return () => {
      rows.forEach((row) => {
        row.removeEventListener("mouseenter", onEnter);
        row.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return null;
}
