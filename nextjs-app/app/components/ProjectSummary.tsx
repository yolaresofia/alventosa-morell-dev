"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { ProjectSummary as ProjectSummaryType } from "@/sanity.types";

type ProjectSummaryProps = {
  block: ProjectSummaryType;
};

export const ProjectSummary = ({ block }: ProjectSummaryProps) => {
  const { language } = useLanguage();
  const { number, title, description } = block;
  
  return (
    <section className="w-full px-6 pt-4 pb-24 text-black font-soehne">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-3 flex">
          {number && <p className="md:text-base text-sm pr-2">{number}</p>}
          {title && <h2 className="md:text-base text-sm leading-[1.5]">{title}</h2>}
        </div>
        <div className="col-span-12 md:col-span-8 pt-24 lg:pt-0">
          {description && (
            <p className="md:text-base text-sm leading-[1.5]">
              {getTranslation(description, language)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
