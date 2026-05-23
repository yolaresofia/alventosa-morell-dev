"use client";

import { PortableText, PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { useLocale } from "../i18n/client";
import { localizedPortableText, localizedText } from "../i18n/text";
import { type UiText } from "../i18n/uiText";

export default function AboutPageClient({ about, uiText }: { about: any; uiText?: UiText | null }) {
  const locale = useLocale();

  if (!about) return <div>Loading...</div>;

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col">
      <div className="md:text-2xl text-[20px] monitor:text-3xl font-medium tracking-wide pb-12">
        <PortableText
          value={
            localizedPortableText(
              about.aboutText,
              locale
            ) as PortableTextBlock[]
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 md:grid-cols-6 gap-8 text-sm monitor:text-xl flex-grow">
        <div className="col-span-2">
          <h2>{localizedText(about.contact?.titleTranslations, locale)}</h2>
          <a href={`mailto:${about.contact?.email || ""}`}>
            {about.contact?.email}
          </a>
          <br />
          <a href={`tel:${about.contact?.phone || ""}`}>
            {about.contact?.phone}
          </a>

          <h2 className="mt-4">
            {localizedText(about.office?.titleTranslations, locale)}
          </h2>
          <a href={about.office?.addressUrl?.href || ""} target="_blank" rel="noopener noreferrer">
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
                localizedPortableText(
                  about.aboutInfo,
                  locale
                ) as PortableTextBlock[]
              }
            />
          </div>
        </div>

        <div className="col-span-2">
          <h2>{localizedText(about.team?.titleTranslations, locale)}</h2>
          {about.team?.coFounders?.map((member: any) => (
            <div key={member._key || member.name} className="py-4">
              <p>{member.name}</p>
              <p>{localizedText(member.role, locale)}</p>
            </div>
          ))}
          {about.team?.teammates?.map((member: any) => (
            <div key={member._key || member.name}>
              <p>{member.name}</p>
            </div>
          ))}
          <h2 className="pb-4 pt-8">
            {localizedText(
              about.team?.pastTeammatesTitleTranslations,
              locale
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
            {localizedText(about.awards?.titleTranslations, locale)}
          </h2>
          {about.awards?.list?.map((award: any) => (
            <div key={award._key || award.title}>
              <p>{award.title}</p>
            </div>
          ))}
          <div className="pt-4">
            {about.cv.map((entry: any) => {
              const title = localizedText(entry.title, locale);
              const fileUrl = entry.file?.asset?.url;
              return (
                <div key={entry._key || title}>
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

      <nav className="pt-2 text-sm monitor:text-xl flex gap-6 justify-end">
        <Link href={`/${locale}/projects`} className="underline">
          {localizedText(uiText?.common?.viewProjects, locale)}
        </Link>
        <Link href={`/${locale}`} className="underline">
          {localizedText(uiText?.navigation?.home, locale)}
        </Link>
      </nav>
    </section>
  );
}
