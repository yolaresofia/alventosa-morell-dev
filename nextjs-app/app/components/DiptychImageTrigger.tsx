"use client";

import { useEffect } from "react";
import { useImageSlider } from "@/app/context/ImageSliderContext";

type SliderImage = { url: string; alt: string };

type Props = {
  /** The image URL this trigger should open in the slider when clicked. */
  imageUrl: string;
  altText: string;
  /** Full set of images registered together so the slider has consistent navigation. Both triggers in a diptych share the same set. */
  sliderImages: SliderImage[];
  componentId: string;
};

/**
 * Invisible client overlay sitting on top of a server-rendered diptych image.
 * Registers all four images (or two, if no hover variants) with the slider
 * context, then opens the slider at this image's index when clicked.
 */
export default function DiptychImageTrigger({
  imageUrl,
  altText,
  sliderImages,
  componentId,
}: Props) {
  const { addImages, openSlider, getImageIndex } = useImageSlider();

  useEffect(() => {
    addImages(sliderImages, componentId);
  }, [sliderImages, componentId, addImages]);

  const handleClick = () => {
    const index = getImageIndex(imageUrl);
    if (index >= 0) openSlider(index);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={altText || "Open image"}
      className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0 z-10"
    />
  );
}
