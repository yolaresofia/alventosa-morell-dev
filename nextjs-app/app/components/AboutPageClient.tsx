"use client";

import { PortableText, PortableTextBlock } from "next-sanity";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPageClient({ about }: { about: any }) {
  const router = useRouter();
  const { language } = useLanguage();

  const getTranslation = (field: any) => field?.[language] || field?.en || "";

  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElements = [
      "A", "P", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON",
    ];
    if (!interactiveElements.includes(target.tagName)) {
      router.push("/");
    }
  };

  if (!about) return <div>Loading...</div>;

  return (
    <section
      className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col"
      onClick={handleBackgroundClick}
    >
      <div className="md:text-2xl text-lg font-medium leading-tight md:pb-24">
        <PortableText value={getTranslation(about.aboutText) as PortableTextBlock[]} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-sm flex-grow">
        <div className="col-span-1">
          <h2>{getTranslation(about.contact?.titleTranslations)}</h2>
          <a href={`mailto:${about.contact?.email || ""}`}>
            {about.contact?.email}
          </a>
          <a href={`tel:${about.contact?.phone || ""}`}>
            {about.contact?.phone}
          </a>

          <h2 className="mt-4">
            {getTranslation(about.office?.titleTranslations)}
          </h2>
          <a href={about.office?.addressUrl?.href || ""} target="_blank">
            <PortableText value={about.office?.address as PortableTextBlock[]} />
          </a>

          <div className="flex flex-col py-4">
            <a href={about.social?.instagram?.href || ""} target="_blank">
              {about.social?.instagram?.urlTitle}
            </a>
          </div>

          <div className="text-sm">
            <PortableText value={getTranslation(about.aboutInfo) as PortableTextBlock[]} />
          </div>
        </div>

        <div className="col-span-1">
          <h2>{getTranslation(about.team?.titleTranslations)}</h2>
          {about.team?.coFounders?.map((member: any) => (
            <div key={member._key || member.name} className="py-4">
              <p>{member.name}</p>
              <p>{getTranslation(member.role)}</p>
            </div>
          ))}
          {about.team?.teammates?.map((member: any) => (
            <div key={member._key || member.name}>
              <p>{member.name}</p>
            </div>
          ))}
          <h2 className="pb-4">{getTranslation(about.team?.pastTeammatesTitleTranslations)}</h2>
          {about.team?.pastTeammates?.map((member: any) => (
            <div key={member._key || member.name}>
              <p>{member.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
