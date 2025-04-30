"use client";

import { SanityDocument } from "next-sanity";
import { useOptimistic } from "next-sanity/hooks";
import Link from "next/link";

import BlockRenderer from "@/app/components/BlockRenderer";
import { dataAttr } from "@/sanity/lib/utils";
import { studioUrl } from "@/sanity/lib/api";

type PageBuilderProps = {
  page: SanityDocument;
};

type BuilderSection = {
  _key: string;
  _type: string;
};

type PageData = {
  _id: string;
  _type: "page" | "project";
  pageBuilder?: BuilderSection[];
  builder?: BuilderSection[];
};

function renderSections(
  sections: BuilderSection[],
  page: PageData,
  builderKey: "pageBuilder" | "builder"
) {
  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: builderKey,
      }).toString()}
    >
      {sections.map((block: any, index: number) => (
        <BlockRenderer
          key={block._key}
          index={index}
          block={block}
          pageId={page._id}
          pageType={page._type}
        />
      ))}
    </div>
  );
}

function renderEmptyState(page: PageData, builderKey: "pageBuilder" | "builder") {
  return (
    <div className="container">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        Aquesta pàgina no té contingut!
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Obre la pàgina al Sanity Studio per afegir-hi contingut.
      </p>
      <div className="mt-10 flex">
        <Link
          className="rounded-full flex gap-2 mr-6 items-center bg-black hover:bg-red-500 focus:bg-cyan-500 py-3 px-6 text-white transition-colors duration-200"
          href={`${studioUrl}/structure/intent/edit/template=${page._type};type=${page._type};path=${builderKey};id=${page._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Afegeix contingut
        </Link>
      </div>
    </div>
  );
}

export default function PageBuilder({ page }: PageBuilderProps) {
  const builderKey: "pageBuilder" | "builder" =
    page._type === "project" ? "builder" : "pageBuilder";

  const pageBuilderSections = useOptimistic<
    BuilderSection[] | undefined,
    SanityDocument<PageData>
  >(page?.[builderKey], (currentSections, action) => {
    if (action.id !== page._id) {
      return currentSections;
    }

    const updatedSections = action.document?.[builderKey];
    if (updatedSections) {
      return updatedSections.map(
        (section) =>
          currentSections?.find((s) => s._key === section?._key) || section
      );
    }

    return currentSections;
  });

  return pageBuilderSections && pageBuilderSections.length > 0
    ? renderSections(pageBuilderSections, page as PageData, builderKey)
    : renderEmptyState(page as PageData, builderKey);
}
