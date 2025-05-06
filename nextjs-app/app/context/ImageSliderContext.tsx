"use client";

import { createContext, useContext, useState } from "react";

type Image = {
  url: string;
  alt?: string;
};

type ImageSliderContextType = {
  images: Image[];
  setImages: (images: Image[]) => void;
  addImages: (images: Image[]) => number;
  isOpen: boolean;
  currentIndex: number;
  openSlider: (index: number) => void;
  closeSlider: () => void;
  goToNext: () => void;
  goToPrev: () => void;
};

const ImageSliderContext = createContext<ImageSliderContextType | undefined>(undefined);

export function ImageSliderProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openSlider = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeSlider = () => setIsOpen(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const addImages = (newImages: Image[]) => {
    const startIndex = images.length;
    setImages((prev) => [...prev, ...newImages]);
    return startIndex;
  };

  return (
    <ImageSliderContext.Provider
      value={{
        images,
        setImages,
        addImages,
        isOpen,
        currentIndex,
        openSlider,
        closeSlider,
        goToNext,
        goToPrev,
      }}
    >
      {children}
    </ImageSliderContext.Provider>
  );
}

export const useImageSlider = () => {
  const context = useContext(ImageSliderContext);
  if (!context) {
    throw new Error("useImageSlider must be used inside ImageSliderProvider");
  }
  return context;
};
