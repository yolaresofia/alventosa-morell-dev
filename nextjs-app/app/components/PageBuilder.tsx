import { SanityDocument } from "next-sanity";
import Link from "next/link";

import BlockRenderer from "@/app/components/BlockRenderer";
import { dataAttr } from "@/sanity/lib/utils";
import { studioUrl } from "@/sanity/lib/api";
import type { Locale } from "@/app/i18n/config";

type PageBuilderProps = {
  page: SanityDocument;
  locale: Locale;
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
  builderKey: "pageBuilder" | "builder",
  locale: Locale,
) {
  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: builderKey,
      }).toString()}
    >
      {sections.map((block: any) => (
        <BlockRenderer
          key={block._key}
          block={block}
          pageId={page._id}
          pageType={page._type}
          locale={locale}
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

/**
 * Server component that renders a page's builder sections. Draft mode visual
 * feedback still works through SanityLive + VisualEditing wired in the root
 * layout — the optimistic-section-merge hook that used to live here was the
 * only reason this needed to be a client component.
 */
export default function PageBuilder({ page, locale }: PageBuilderProps) {
  const builderKey: "pageBuilder" | "builder" =
    page._type === "project" ? "builder" : "pageBuilder";
  const sections = page?.[builderKey] as BuilderSection[] | undefined;

  return sections && sections.length > 0
    ? renderSections(sections, page as PageData, builderKey, locale)
    : renderEmptyState(page as PageData, builderKey);
}
