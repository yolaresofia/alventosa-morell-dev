"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

export default function HomePageClient({ homepage }: { homepage: any }) {
  const projects = homepage?.featuredProjects || [];
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target) {
          const slug = visible.target.getAttribute("data-slug");
          if (slug) setCurrentSlug(slug);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    const elements = containerRef.current?.querySelectorAll("[data-slug]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projects]);

  if (!projects.length) return <div>No featured projects</div>;

  return (
    <section className="w-full overflow-x-auto pb-12">
      <div
        className="flex items-end snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        ref={containerRef}
      >
        {projects.map((project: any) => {
          const imageUrl = project.featuredImage
            ? urlForImage(project.featuredImage)?.url()
            : null;
          const slug = project.slug?.current;

          if (!slug || !imageUrl) return null;

          const isFocused = hoveredSlug === slug || currentSlug === slug;

          return (
            <Link
              href={`/projects/${slug}`}
              key={slug}
              data-slug={slug}
              onMouseEnter={() => setHoveredSlug(slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="snap-center flex-shrink-0 flex flex-col items-start transition-opacity duration-300"
              style={{
                opacity: isFocused ? 1 : 0.2,
              }}
            >
              <div className="h-[85vh] w-auto relative">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  width={1000}
                  height={1500}
                  className="h-[85vh] w-auto object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-2 text-sm pl-4 font-medium leading-tight flex">
                <div className="pr-3">{project.projectNumber}</div>
                <div>{project.title}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
