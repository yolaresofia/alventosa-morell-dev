"use client";

import { useImageSlider } from "../context/ImageSliderContext";
import { CloseButton } from "./CloseButton";
import { LeftArrow } from "./LeftArrow";
import { RightArrow } from "./RightArrow";

export default function PopupSlider() {
  const { isOpen, images, currentIndex, closeSlider, goToNext, goToPrev } =
    useImageSlider();
  const image = images[currentIndex];

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white flex items-center justify-center">
      <button
        onClick={closeSlider}
        className="absolute top-4 right-4"
        aria-label="Tancar"
      >
        <CloseButton />
      </button>
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2"
        aria-label="Imatge anterior"
      >
        <LeftArrow />
      </button>
      <img
        src={image.url}
        alt={image.alt || ""}
        className="max-h-[90vh] max-w-[90vw]"
      />
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2"
        aria-label="Imatge següent"
      >
        <RightArrow />
      </button>
    </div>
  );
}
