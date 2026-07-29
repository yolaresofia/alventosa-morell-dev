"use client";

import { useEffect } from "react";
import { useImageSlider } from "@/app/context/ImageSliderContext";

type Props = {
  imageUrl: string;
  altText: string;
};

/**
 * Invisible client overlay sitting on top of the server-rendered monoptych
 * image. Registers the image with the popup-slider context on mount and opens
 * the slider when the user clicks anywhere inside it. Kept separate so the
 * image markup itself stays purely server-rendered.
 */
export default function MonoptychImageTrigger({ imageUrl, altText }: Props) {
  const { addImages, openSlider, getImageIndex } = useImageSlider();

  useEffect(() => {
    const componentId = `monoptych-${imageUrl}`;
    addImages([{ url: imageUrl, alt: altText }], componentId);
  }, [imageUrl, altText, addImages]);

  const handleClick = () => {
    const index = getImageIndex(imageUrl);
    if (index >= 0) openSlider(index);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={altText || "Open image"}
      className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0"
    />
  );
}
