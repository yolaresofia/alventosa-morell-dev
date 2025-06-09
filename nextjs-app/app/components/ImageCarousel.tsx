"use client"

import { useState, useEffect, useRef } from "react"
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
          const url = img.image ? urlForImage(img.image)?.url() : undefined
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
  }, [images, language, addImages, block._key])

  const handleImageClick = () => {
    const currentImage = images[currentIndex]
    const imageUrl = urlForImage(currentImage.image)?.url()

    if (imageUrl) {
      const sliderIndex = getImageIndex(imageUrl)
      if (sliderIndex >= 0) {
        openSlider(sliderIndex)
      }
    }
  }

  if (images.length < 2 || baseIndex === null) return null

  const currentImage = images[currentIndex]
  const imageUrl = urlForImage(currentImage.image)?.url() || ""
  const alt = getTranslation(currentImage.altText, language)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <section className="w-full bg-white pt-24 pb-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 lg:px-32 relative">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button onClick={handlePrev} className="flex-shrink-0 z-10" aria-label="Imatge anterior">
            <LeftArrow />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[3/2] cursor-pointer bg-gray-100 overflow-hidden"
            onClick={handleImageClick}
          >
            <div
              className="w-full h-full bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${imageUrl || "/placeholder.svg?height=400&width=600"})`,
              }}
              role="img"
              aria-label={alt}
            >
              <span className="sr-only">{alt}</span>
            </div>
          </div>

          <button onClick={handleNext} className="flex-shrink-0 z-10" aria-label="Imatge següent">
            <RightArrow />
          </button>
        </div>
      </div>
    </section>
  )
}
