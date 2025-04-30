"use client";

import { useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { getTranslation } from "@/app/utils/translations";
import { ImageCarousel as ImageCarouselType } from "@/sanity.types";
import { LeftArrow } from "./LeftArrow";
import { RightArrow } from "./RightArrow";

type Props = {
  block: ImageCarouselType;
};

export const ImageCarousel = ({ block }: Props) => {
  const images = block.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const language: "ca" | "es" | "en" = "ca";

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (images.length < 2) return null;

  const currentImage = images[currentIndex];
  const imageUrl = urlForImage(currentImage.image)?.url() || "";
  const alt = getTranslation(currentImage.altText, language);

  return (
    <section className="w-full bg-white py-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 relative">
        <div className="relative w-full max-w-4xl aspect-[3/2]">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-contain"
          />

          <button
            onClick={handlePrev}
            className="absolute -left-8 top-1/2 transform -translate-y-1/2"
            aria-label="Imatge anterior"
          >
            <LeftArrow />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            aria-label="Imatge següent"
          >
            <RightArrow />
          </button>
        </div>
      </div>
    </section>
  );
};
