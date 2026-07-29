"use client";

import { useEffect, useState } from "react";
import { LeftArrow } from "./LeftArrow";
import { RightArrow } from "./RightArrow";
import { useImageSlider } from "@/app/context/ImageSliderContext";

type SliderImage = { url: string; alt: string };

type Props = {
  /** Total number of images in the server-rendered carousel. */
  imagesCount: number;
  /** Full set of images (high-res) registered with the popup-slider context. */
  sliderImages: SliderImage[];
  /** Identifier for the popup-slider context. */
  componentId: string;
};

/**
 * Client island that upgrades the static server-rendered carousel into an
 * interactive one. Finds the matching [data-carousel-id] container in the DOM
 * (rendered server-side), tracks the current image index, toggles opacity on
 * the pre-rendered images and overlays prev/next arrows + a click handler
 * that opens the popup slider.
 */
export default function ImageCarouselInteractive({
  imagesCount,
  sliderImages,
  componentId,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addImages, openSlider, getImageIndex } = useImageSlider();

  useEffect(() => {
    addImages(sliderImages, componentId);
  }, [sliderImages, componentId, addImages]);

  useEffect(() => {
    const container = document.querySelector<HTMLElement>(
      `[data-carousel-id="${componentId}"]`,
    );
    if (!container) return;
    const images = container.querySelectorAll<HTMLElement>("[data-carousel-image]");
    images.forEach((img) => {
      const idx = Number(img.dataset.carouselIndex);
      const active = idx === currentIndex;
      img.style.opacity = active ? "1" : "0";
      img.style.pointerEvents = active ? "auto" : "none";
    });
  }, [currentIndex, componentId]);

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? imagesCount - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i === imagesCount - 1 ? 0 : i + 1));

  const handleImageClick = () => {
    const current = sliderImages[currentIndex];
    if (!current) return;
    const sliderIndex = getImageIndex(current.url);
    if (sliderIndex >= 0) openSlider(sliderIndex);
  };

  return (
    <>
      {/* Invisible click target sitting on top of the active image */}
      <button
        type="button"
        onClick={handleImageClick}
        aria-label={sliderImages[currentIndex]?.alt || "Open image"}
        className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0 z-0"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-10 pointer-events-auto"
        aria-label="Imatge anterior"
      >
        <LeftArrow />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-10 pointer-events-auto"
        aria-label="Imatge següent"
      >
        <RightArrow />
      </button>
    </>
  );
}
