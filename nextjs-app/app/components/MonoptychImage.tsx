"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    if (imageUrl) {
      const componentId = `monoptych-${block._key || Math.random().toString(36).substr(2, 9)}`
      const index = addImages([{ url: imageUrl, alt: altText }], componentId)
      setImageIndex(index)
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

  if (!imageUrl || imageIndex === null) return null

  return (
    <section className="w-full px-8 md:px-24 lg:px-32 xl:px-48 pt-24 pb-24">
      <div className="max-w-5xl mx-auto">
        <div
          className="w-full h-[70vh] bg-center bg-cover cursor-pointer"
          style={{ backgroundImage: `url(${imageUrl})` }}
          onClick={handleClick}
          role="img"
          aria-label={altText}
          title={altText}
        />
      </div>
    </section>
  )
}
