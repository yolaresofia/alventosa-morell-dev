"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useImageSlider } from "../context/ImageSliderContext";
import { CloseButton } from "./CloseButton";
import { LeftArrow } from "./LeftArrow";
import { RightArrow } from "./RightArrow";

export default function PopupSlider() {
  const { isOpen, images, currentIndex, closeSlider, goToNext, goToPrev } = useImageSlider();
  const image = images[currentIndex];

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrev();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "Escape") {
        closeSlider();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrev, goToNext, closeSlider]);

  if (!isOpen || !image) return null;

  const altText = image.alt || "";
  const safeSrc = image.url || "/placeholder.svg";

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <button onClick={closeSlider} className="absolute top-4 right-4" aria-label="Tancar">
        <CloseButton />
      </button>
      <button
        onClick={goToPrev}
        className="absolute md:left-4 left-2 top-1/2 -translate-y-1/2"
        aria-label="Imatge anterior"
      >
        <LeftArrow />
      </button>
      <div className="relative w-full max-w-[90vw] max-h-[95vh] px-4">
        <div className="relative w-full" style={{ height: "min(95vh, 70vw)" }}>
          <Image
            src={safeSrc}
            alt={altText}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 60vw"
            priority={false}
            unoptimized
          />
        </div>
      </div>
      <button
        onClick={goToNext}
        className="absolute md:right-4 right-2 top-1/2 -translate-y-1/2"
        aria-label="Imatge següent"
      >
        <RightArrow />
      </button>
    </div>
  );
}
