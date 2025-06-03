"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { DiptychImage as DiptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { getTranslation } from "@/app/utils/translations";
import { useImageSlider } from "../context/ImageSliderContext";

type Props = {
  block: DiptychImageType & { _key?: string };
};

export const DiptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca";
  const { addImages, openSlider, getImageIndex } = useImageSlider();

  const [isDesktop, setIsDesktop] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);
  const [baseIndex, setBaseIndex] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const leftImageUrl = block.leftImage
    ? urlForImage(block.leftImage)?.url()
    : undefined;
  const leftHoverUrl = block.leftImageOnHover
    ? urlForImage(block.leftImageOnHover)?.url()
    : undefined;

  const rightImageUrl = block.rightImage
    ? urlForImage(block.rightImage)?.url()
    : undefined;
  const rightHoverUrl = block.rightImageOnHover
    ? urlForImage(block.rightImageOnHover)?.url()
    : undefined;

  const leftAlt = getTranslation(block.leftAltText, language);
  const rightAlt = getTranslation(block.rightAltText, language);
  const leftAltHover = getTranslation(block.leftHoverAltText, language);
  const rightAltHover = getTranslation(block.rightHoverAltText, language);

  useEffect(() => {
    const imagesToAdd = [];

    if (leftImageUrl) {
      imagesToAdd.push({ url: leftImageUrl, alt: leftAlt });
      if (leftHoverUrl) {
        imagesToAdd.push({ url: leftHoverUrl, alt: `${leftAltHover} (hover)` });
      }
    }

    if (rightImageUrl) {
      imagesToAdd.push({ url: rightImageUrl, alt: rightAlt });
      if (rightHoverUrl) {
        imagesToAdd.push({
          url: rightHoverUrl,
          alt: `${rightAltHover} (hover)`,
        });
      }
    }

    if (imagesToAdd.length) {
      const componentId = `diptych-${block._key || Math.random().toString(36).substr(2, 9)}`;
      const index = addImages(imagesToAdd, componentId);
      setBaseIndex(index);
    }
  }, [
    leftImageUrl,
    rightImageUrl,
    leftHoverUrl,
    rightHoverUrl,
    leftAlt,
    rightAlt,
    leftAltHover,
    rightAltHover,
    addImages,
    block._key,
  ]);

  const handleLeftClick = () => {
    if (leftImageUrl) {
      const currentIndex = getImageIndex(leftImageUrl);
      if (currentIndex >= 0) openSlider(currentIndex);
    }
  };

  const handleRightClick = () => {
    if (rightImageUrl) {
      const currentIndex = getImageIndex(rightImageUrl);
      if (currentIndex >= 0) openSlider(currentIndex);
    }
  };

  if (!leftImageUrl || !rightImageUrl || baseIndex === null) return null;

  return (
    <section className="w-full px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 pt-24 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT IMAGE */}
          <div
            className="relative w-full aspect-[3/4] cursor-pointer"
            onClick={handleLeftClick}
            onMouseEnter={() => isDesktop && setHoverLeft(true)}
            onMouseLeave={() => isDesktop && setHoverLeft(false)}
          >
            <Image
              src={leftImageUrl}
              alt={leftAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setLeftLoaded(true)}
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                isDesktop && hoverLeft && leftHoverUrl
                  ? "opacity-0"
                  : "opacity-100"
              } ${leftLoaded ? "blur-0" : "blur-md"}`}
              unoptimized
            />

            {isDesktop && leftHoverUrl && (
              <Image
                src={leftHoverUrl}
                alt={leftAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${
                  hoverLeft ? "opacity-100" : "opacity-0"
                }`}
                unoptimized
              />
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="relative w-full aspect-[3/4] cursor-pointer"
            onClick={handleRightClick}
            onMouseEnter={() => isDesktop && setHoverRight(true)}
            onMouseLeave={() => isDesktop && setHoverRight(false)}
          >
            <Image
              src={rightImageUrl}
              alt={rightAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setRightLoaded(true)}
              className={`object-cover transition-opacity duration-300 ease-in-out ${
                isDesktop && hoverRight && rightHoverUrl
                  ? "opacity-0"
                  : "opacity-100"
              } ${rightLoaded ? "blur-0" : "blur-md"}`}
              unoptimized
            />

            {isDesktop && rightHoverUrl && (
              <Image
                src={rightHoverUrl}
                alt={rightAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${
                  hoverRight ? "opacity-100" : "opacity-0"
                }`}
                unoptimized
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
