"use client";

import { useState, useEffect } from "react";
import { getTranslation } from "../utils/translations";
import { urlForImage } from "@/sanity/lib/utils";
import type { CoverImage as CoverImageType } from "@/sanity.types";

type CoverImageProps = {
  block: CoverImageType;
};

export const CoverImage = ({ block }: CoverImageProps) => {
  const [language] = useState<"ca" | "es" | "en">("ca");
  const [isMobile, setIsMobile] = useState(false);

  const alt = getTranslation(block.altText, language);
  const desktopImageUrl = block.image ? urlForImage(block.image)?.url() : undefined;
  const mobileImageUrl = block.mobileImage ? urlForImage(block.mobileImage)?.url() : undefined;
  const hasPadding = block.hasPadding || false;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const imageUrl = isMobile && mobileImageUrl ? mobileImageUrl : desktopImageUrl;

  if (!imageUrl) return null;

  const containerClass = hasPadding
    ? "w-full py-24"
    : "w-full h-screen";

  const imageClass = hasPadding
    ? "w-full h-[calc(100vh-12rem)] bg-center bg-cover"
    : "w-full h-screen bg-center bg-cover";

  return (
    <div className={containerClass}>
      <div
        className={imageClass}
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label={alt}
      >
        <span className="sr-only">{alt}</span>
      </div>
    </div>
  );
};
