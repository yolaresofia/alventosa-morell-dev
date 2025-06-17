"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/utils"
import { getTranslation } from "@/app/utils/translations"
import type { ImageCarousel as ImageCarouselType } from "@/sanity.types"
import { LeftArrow } from "./LeftArrow"
import { RightArrow } from "./RightArrow"
import { useImageSlider } from "../context/ImageSliderContext"

type Props = {
  block: ImageCarouselType & { _key?: string }
}

export const ImageCarousel = ({ block }: Props) => {
  const images = block.images || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [baseIndex, setBaseIndex] = useState<number | null>(null)
  const hasAddedImages = useRef(false)
  const language: "ca" | "es" | "en" = "ca"

  const { addImages, openSlider, getImageIndex } = useImageSlider()

  useEffect(() => {
    if (!hasAddedImages.current && images.length > 0) {
      const sliderImages = images
        .map((img) => {
          if (!img.image?.asset) return null

          const url = urlForImage(img.image)
            ?.width(2400)
            .quality(100)
            .auto("format")
            .url()

          if (!url) return null

          const alt = getTranslation(img.altText, language)
          return { url, alt }
        })
        .filter(Boolean) as { url: string; alt?: string }[]

      if (sliderImages.length > 0) {
        const componentId = `carousel-${block._key || Math.random().toString(36).substr(2, 9)}`
        const index = addImages(sliderImages, componentId)
        setBaseIndex(index)
        hasAddedImages.current = true
      }
    }
  }, [images, addImages, block._key, language])

  const handleImageClick = () => {
    const currentImage = images[currentIndex]
    const imageUrl = urlForImage(currentImage.image)
      ?.width(2400)
      .quality(100)
      .auto("format")
      .url()

    if (imageUrl) {
      const sliderIndex = getImageIndex(imageUrl)
      if (sliderIndex >= 0) {
        openSlider(sliderIndex)
      }
    }
  }

  if (images.length < 2 || baseIndex === null) return null

  const currentImage = images[currentIndex]
  const imageUrl = urlForImage(currentImage.image)
    ?.width(1600)
    .quality(85)
    .auto("format")
    .url() || "/placeholder.svg"

  const alt = getTranslation(currentImage.altText, language)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <section className="w-full bg-white pt-24 pb-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex justify-center items-center relative">
        <div className="w-full px-16 sm:px-20 md:px-24 lg:px-32">
          <div
            className="relative w-full max-w-sm sm:max-w-2xl md:max-w-4xl aspect-[3/2] cursor-pointer mx-auto"
            onClick={handleImageClick}
          >
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) calc(100vw - 128px), (max-width: 768px) calc(100vw - 160px), (max-width: 1024px) calc(100vw - 192px), calc(100vw - 256px)"
              className="object-contain"
            />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-10 pointer-events-auto"
          aria-label="Imatge anterior"
        >
          <LeftArrow />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-10 pointer-events-auto"
          aria-label="Imatge següent"
        >
          <RightArrow />
        </button>
      </div>
    </section>
  )
}
