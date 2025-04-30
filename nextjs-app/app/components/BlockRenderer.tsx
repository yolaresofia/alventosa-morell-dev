import React from "react";

import { dataAttr } from "@/sanity/lib/utils";
import IntroHero from "./IntroHero";
import { CoverImage } from "./CoverImage";
import { ProjectSummary } from "./ProjectSummary";
import { DiptychImage } from "./DiptychImage";
import { ImageCarousel } from "./ImageCarousel";
import { TextBlock } from "./TextBlock";
import { ProjectInfo } from "./ProjectInfo";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

const Blocks: BlocksType = {
  introHero: IntroHero,
  coverImage: CoverImage,
  projectSummary: ProjectSummary,
  diptychImage: DiptychImage,
  imageCarousel: ImageCarousel,
  textBlock: TextBlock,
  projectInfo: ProjectInfo,
};

export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
        })}
      </div>
    );
  }

  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key }
  );
}
