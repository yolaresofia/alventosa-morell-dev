"use client";

import { useEffect, useState } from "react";
import { MonoptychImage as MonoptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { getTranslation } from "@/app/utils/translations";
import { useImageSlider } from "../context/ImageSliderContext";

type Props = {
  block: MonoptychImageType;
};

export const MonoptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca";
  const { addImages, openSlider } = useImageSlider();

  const imageUrl = block.image ? urlForImage(block.image)?.url() : undefined;
  const altText = getTranslation(block.altText, language);

  const [imageIndex, setImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrl) {
      const index = addImages([{ url: imageUrl, alt: altText }]);
      setImageIndex(index);
    }
  }, [imageUrl, altText]);

  if (!imageUrl || imageIndex === null) return null;

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-48 pt-48 pb-48">
      <div
        className="w-full h-[70vh] bg-center bg-cover cursor-pointer"
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={() => openSlider(imageIndex)}
        role="img"
        aria-label={altText}
        title={altText}
      />
    </section>
  );
};
