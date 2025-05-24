"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

type Image = {
  url: string
  alt?: string
  componentId?: string // Add component tracking
}

type ImageSliderContextType = {
  images: Image[]
  setImages: (images: Image[]) => void
  addImages: (images: Image[], componentId?: string) => number
  isOpen: boolean
  currentIndex: number
  openSlider: (index: number) => void
  closeSlider: () => void
  goToNext: () => void
  goToPrev: () => void
  getImageIndex: (imageUrl: string) => number
}

const ImageSliderContext = createContext<ImageSliderContextType | undefined>(undefined)

export function ImageSliderProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openSlider = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      setIsOpen(true)
    },
    [],
  )

  const closeSlider = useCallback(() => setIsOpen(false), [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Add images with better tracking
  const addImages = useCallback((newImages: Image[], componentId?: string) => {
    let startIndex = 0

    setImages((prev) => {
      startIndex = prev.length
      const imagesWithId = newImages.map((img) => ({
        ...img,
        componentId: componentId || "unknown",
      }))

      return [...prev, ...imagesWithId]
    })

    return startIndex
  }, [])
  
  const getImageIndex = useCallback(
    (imageUrl: string) => {
      const index = images.findIndex((img) => img.url === imageUrl)
      return index
    },
    [images],
  )

  const value = {
    images,
    setImages,
    addImages,
    isOpen,
    currentIndex,
    openSlider,
    closeSlider,
    goToNext,
    goToPrev,
    getImageIndex,
  }

  return <ImageSliderContext.Provider value={value}>{children}</ImageSliderContext.Provider>
}

export const useImageSlider = () => {
  const context = useContext(ImageSliderContext)
  if (!context) {
    throw new Error("useImageSlider must be used inside ImageSliderProvider")
  }
  return context
}
