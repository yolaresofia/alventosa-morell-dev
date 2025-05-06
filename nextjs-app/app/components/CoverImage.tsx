"use client";

import { useEffect, useState } from "react";
import { getTranslation } from "../utils/translations";
import { urlForImage } from "@/sanity/lib/utils";
import { CoverImage as CoverImageType } from "@/sanity.types";
import { useImageSlider } from "../context/ImageSliderContext";

type CoverImageProps = {
  block: CoverImageType;
};

export const CoverImage = ({ block }: CoverImageProps) => {
  const [language] = useState<"ca" | "es" | "en">("ca");
  const { addImages, openSlider } = useImageSlider();

  const alt = getTranslation(block.altText, language);
  const imageUrl = block.image ? urlForImage(block.image)?.url() : undefined;

  const [imageIndex, setImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrl) {
      const index = addImages([{ url: imageUrl, alt }]);
      setImageIndex(index);
    }
  }, [imageUrl, alt]);

  if (!imageUrl || imageIndex === null) return null;

  return (
    <div
      className="w-full h-screen bg-center bg-cover cursor-pointer"
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="img"
      aria-label={alt}
      onClick={() => openSlider(imageIndex)}
    >
      <span className="sr-only">{alt}</span>
    </div>
  );
};
