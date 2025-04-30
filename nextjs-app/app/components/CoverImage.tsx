"use client";
import { useState } from "react";
import { getTranslation } from "../utils/translations";
import { urlForImage } from "@/sanity/lib/utils";
import { CoverImage as CoverImageType } from "@/sanity.types";

type CoverImageProps = {
  block: CoverImageType;
};

export const CoverImage = ({ block }: CoverImageProps) => {
  const [language] = useState<"ca" | "es" | "en">("ca");

  const alt = getTranslation(block.altText, language);
  const imageUrl = block.image ? urlForImage(block?.image)?.url() : "";
  const pt = block.paddingTop ? `pt-${block.paddingTop}` : "";
  const pb = block.paddingBottom ? `pb-${block.paddingBottom}` : "";

  if (!imageUrl) return null;

  return (
    <div
      className={`w-full h-screen bg-center bg-cover ${pt} ${pb}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="img"
      aria-label={alt}
    >
      <span className="sr-only">{alt}</span>
    </div>
  );
};
