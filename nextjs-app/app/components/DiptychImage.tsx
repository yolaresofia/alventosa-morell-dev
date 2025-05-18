"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DiptychImage as DiptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { getTranslation } from "@/app/utils/translations";
import { useImageSlider } from "../context/ImageSliderContext";

type Props = {
  block: DiptychImageType;
};

export const DiptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca";
  const { addImages, openSlider } = useImageSlider();

  const leftImageUrl = block.leftImage
    ? urlForImage(block.leftImage)?.url()
    : undefined;

  const rightImageUrl = block.rightImage
    ? urlForImage(block.rightImage)?.url()
    : undefined;

  const leftAlt = getTranslation(block.leftAltText, language);
  const rightAlt = getTranslation(block.rightAltText, language);

  const [baseIndex, setBaseIndex] = useState<number | null>(null);
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);

  useEffect(() => {
    if (leftImageUrl && rightImageUrl) {
      const index = addImages([
        { url: leftImageUrl, alt: leftAlt },
        { url: rightImageUrl, alt: rightAlt },
      ]);
      setBaseIndex(index);
    }
  }, [leftImageUrl, rightImageUrl, leftAlt, rightAlt, addImages]);

  if (!leftImageUrl || !rightImageUrl || baseIndex === null) return null;

  return (
    <section className="w-full px-4 sm:px-8 md:px-16 lg:px-48 pt-48 pb-48">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="relative w-full aspect-[3/4] cursor-pointer"
          onClick={() => openSlider(baseIndex)}
        >
          <Image
            src={leftImageUrl}
            alt={leftAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setLeftLoaded(true)}
            className={`object-cover ${leftLoaded ? "blur-0" : "blur-md"}`}
          />
        </div>
        <div
          className="relative w-full aspect-[3/4] cursor-pointer"
          onClick={() => openSlider(baseIndex + 1)}
        >
          <Image
            src={rightImageUrl}
            alt={rightAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setRightLoaded(true)}
            className={`object-cover ${rightLoaded ? "blur-0" : "blur-md"}`}
          />
        </div>
      </div>
    </section>
  );
};
