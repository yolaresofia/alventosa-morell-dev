"use client";
import { ProjectSummary as ProjectSummaryType } from "@/sanity.types";

type ProjectSummaryProps = {
  block: ProjectSummaryType;
};

export const ProjectSummary = ({ block }: ProjectSummaryProps) => {
  const { number, title, description } = block;

  return (
    <section className="w-full px-4 pt-4 text-black">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-3 flex">
          {number && <p className="text-base pr-2">{number}</p>}
          {title && (
            <h2 className="text-base leading-tight">
              {title}
            </h2>
          )}
        </div>
        <div className="col-span-12 md:col-span-8">
          {description && (
            <p className="text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
