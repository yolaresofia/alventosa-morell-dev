"use client";

import { PortableText, PortableTextBlock } from "next-sanity";
import { useLanguage } from "../context/LanguageContext";
import {
  getPortableTextTranslation,
  getTranslation,
} from "../utils/translations";

export default function AboutPageClient({ about }: { about: any }) {
  const { language } = useLanguage();

  if (!about) return <div>Loading...</div>;

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col">
      <div className="md:text-2xl text-[20px] monitor:text-3xl font-medium leading-[1.5] tracking-wide pb-16">
        <PortableText
          value={
            getPortableTextTranslation(
              about.aboutText,
              language
            ) as PortableTextBlock[]
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 md:grid-cols-6 gap-8 text-sm monitor:text-xl flex-grow">
        <div className="col-span-2">
          <h2>{getTranslation(about.contact?.titleTranslations, language)}</h2>
          <a href={`mailto:${about.contact?.email || ""}`}>
            {about.contact?.email}
          </a>
          <br />
          <a href={`tel:${about.contact?.phone || ""}`}>
            {about.contact?.phone}
          </a>

          <h2 className="mt-4">
            {getTranslation(about.office?.titleTranslations, language)}
          </h2>
          <a href={about.office?.addressUrl?.href || ""} target="_blank">
            <PortableText
              value={about.office?.address as PortableTextBlock[]}
            />
          </a>

          <div className="flex flex-col py-4">
            <a
              href={about.social?.instagram?.href || ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              {about.social?.instagram?.urlTitle}
            </a>
          </div>

          <div className="text-sm monitor:text-xl">
            <PortableText
              value={
                getPortableTextTranslation(
                  about.aboutInfo,
                  language
                ) as PortableTextBlock[]
              }
            />
          </div>
        </div>

        <div className="col-span-2">
          <h2>{getTranslation(about.team?.titleTranslations, language)}</h2>
          {about.team?.coFounders?.map((member: any) => (
            <div key={member._key || member.name} className="py-4">
              <p>{member.name}</p>
              <p>{getTranslation(member.role, language)}</p>
            </div>
          ))}
          {about.team?.teammates?.map((member: any) => (
            <div key={member._key || member.name}>
              <p>{member.name}</p>
            </div>
          ))}
          <h2 className="pb-4">
            {getTranslation(
              about.team?.pastTeammatesTitleTranslations,
              language
            )}
          </h2>
          {about.team?.pastTeammates?.map((member: any) => (
            <div key={member._key || member.name}>
              <p>{member.name}</p>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          <h2 className="pb-4">
            {getTranslation(about.awards?.titleTranslations, language)}
          </h2>
          {about.awards.list.map((award: any) => (
            <div key={award._key || award.title}>
              <p>{award.title}</p>
            </div>
          ))}
          <div className="pt-4">
            {about.cv.map((entry: any) => {
              const title = getTranslation(entry.title, language);
              const fileUrl = entry.file?.asset?.url;
              return (
                <div key={entry._key || title}>
                  {fileUrl ? (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      {title}
                    </a>
                  ) : (
                    <span>{title}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
