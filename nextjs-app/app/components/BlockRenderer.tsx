import React from "react";

import { dataAttr } from "@/sanity/lib/utils";
import type { Locale } from "@/app/i18n/config";
import { CoverImage } from "./CoverImage";
import { ProjectSummary } from "./ProjectSummary";
import { DiptychImage } from "./DiptychImage";
import { ImageCarousel } from "./ImageCarousel";
import { TextBlock } from "./TextBlock";
import { ProjectInfo } from "./ProjectInfo";
import { MonoptychImage } from "./MonoptychImage";
import { CoverVideo } from "./CoverVideo";

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  block: BlockType;
  pageId: string;
  pageType: string;
  locale: Locale;
};

/**
 * Renders one builder block. Server-side blocks (TextBlock, ProjectSummary,
 * ProjectInfo) receive locale as a prop. Client-side blocks (image / video
 * components with sliders) still consume useLocale() internally for now.
 */
export default function BlockRenderer({ block, pageId, pageType, locale }: BlockProps) {
  const dataSanity = dataAttr({
    id: pageId,
    type: pageType,
    path: `pageBuilder[_key=="${block._key}"]`,
  }).toString();

  const wrap = (child: React.ReactNode) => (
    <div key={block._key} data-sanity={dataSanity}>
      {child}
    </div>
  );

  switch (block._type) {
    case "textBlock":
      return wrap(<TextBlock block={block as any} locale={locale} />);
    case "projectSummary":
      return wrap(<ProjectSummary block={block as any} locale={locale} />);
    case "projectInfo":
      return wrap(<ProjectInfo block={block as any} locale={locale} />);
    case "coverImage":
      return wrap(<CoverImage block={block as any} locale={locale} />);
    case "coverVideo":
      return wrap(<CoverVideo block={block as any} locale={locale} />);
    case "diptychImage":
      return wrap(<DiptychImage block={block as any} locale={locale} />);
    case "monoptychImage":
      return wrap(<MonoptychImage block={block as any} locale={locale} />);
    case "imageCarousel":
      return wrap(<ImageCarousel block={block as any} locale={locale} />);
    default:
      return (
        <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
          A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
        </div>
      );
  }
}
