"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { ProjectInfo as ProjectInfoType } from "@/sanity.types";

type Props = {
  block: ProjectInfoType;
};

export const ProjectInfo = ({ block }: Props) => {
  const { language } = useLanguage();
  const translate = (field: any) => getTranslation(field, language);

  return (
    <section className="w-full px-6 sm:px-8 md:px-6 pb-12 font-soehne max-w-4xl">
      {block.description && (
        <p className="md:text-base text-sm monitor:text-xl text-black font-medium leading-[1.5] mb-16">
          {translate(block.description)}
        </p>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 text-black md:text-base text-sm monitor:text-xl font-medium">
        {block.project && (
          <>
            <div>{translate(block.project.label)}</div>
            <div>{translate(block.project.value)}</div>
          </>
        )}
        {block.year && (
          <>
            <div>{translate(block.year.label)}</div>
            <div>{block.year.value}</div>
          </>
        )}
        {block.location && (
          <>
            <div>{translate(block.location.label)}</div>
            <div>{translate(block.location.value)}</div>
          </>
        )}
        {block.program && (
          <>
            <div>{translate(block.program.label)}</div>
            <div>{translate(block.program.value)}</div>
          </>
        )}
        {block.area && (
          <>
            <div>{translate(block.area.label)}</div>
            <div>{block.area.value}</div>
          </>
        )}
        {block.authors && (
          <>
            <div>{translate(block.authors.label)}</div>
            <div>{translate(block.authors.value)}</div>
          </>
        )}
        {block.team && (
          <>
            <div>{translate(block.team.label)}</div>
            <div>{translate(block.team.value)}</div>
          </>
        )}
        {block.photographer && (
          <>
            <div>{translate(block.photographer.label)}</div>
            <div>{block.photographer.value}</div>
          </>
        )}
        {block.awards?.value?.[language] &&
          block.awards.value[language].length > 0 && (
            <>
              <div>{translate(block.awards.label)}</div>
              <div className="flex flex-col gap-0.5">
                {block.awards.value[language].map(
                  (award: string, idx: number) => (
                    <div key={idx}>{award}</div>
                  )
                )}
              </div>
            </>
          )}
      </div>
    </section>
  );
};
