"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { MonoptychImage as MonoptychImageType } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { getTranslation } from "@/app/utils/translations"
import { useImageSlider } from "../context/ImageSliderContext"

type Props = {
  block: MonoptychImageType & { _key?: string }
}

export const MonoptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca"
  const { addImages, openSlider, getImageIndex } = useImageSlider()

  const imageUrl = block.image ? urlForImage(block.image)?.url() : undefined
  const altText = getTranslation(block.altText, language)

  const [imageIndex, setImageIndex] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (imageUrl) {
      const componentId = `monoptych-${block._key || Math.random().toString(36).substr(2, 9)}`
      const index = addImages([{ url: imageUrl, alt: altText }], componentId)
      setImageIndex(index)
      
      const img = new window.Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = imageUrl
    }
  }, [imageUrl, altText, addImages, block._key])

  const handleClick = () => {
    if (imageUrl) {
      const currentIndex = getImageIndex(imageUrl)
      if (currentIndex >= 0) {
        openSlider(currentIndex)
      }
    }
  }

  if (!imageUrl || imageIndex === null || !imageDimensions) return null

  return (
    <section className="w-full px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="block md:hidden w-full">
          <Image
            src={imageUrl}
            alt={altText}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="w-full h-auto object-contain cursor-pointer"
            onClick={handleClick}
          />
        </div>
        <div
          className="hidden md:block relative cursor-pointer"
          style={{ width: "1024px", height: "661px" }}
          onClick={handleClick}
        >
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
            sizes="1024px"
          />
        </div>
      </div>
    </section>
  )
}
