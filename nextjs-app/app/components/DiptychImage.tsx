"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { DiptychImage as DiptychImageType } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { getTranslation } from "@/app/utils/translations"
import { useImageSlider } from "../context/ImageSliderContext"

type Props = {
  block: DiptychImageType & { _key?: string }
}

export const DiptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca"
  const { addImages, openSlider, getImageIndex } = useImageSlider()

  const leftImageUrl = block.leftImage ? urlForImage(block.leftImage)?.url() : undefined

  const rightImageUrl = block.rightImage ? urlForImage(block.rightImage)?.url() : undefined

  const leftAlt = getTranslation(block.leftAltText, language)
  const rightAlt = getTranslation(block.rightAltText, language)

  const [baseIndex, setBaseIndex] = useState<number | null>(null)
  const [leftLoaded, setLeftLoaded] = useState(false)
  const [rightLoaded, setRightLoaded] = useState(false)

  useEffect(() => {
    if (leftImageUrl && rightImageUrl) {
      const componentId = `diptych-${block._key || Math.random().toString(36).substr(2, 9)}`
      const index = addImages(
        [
          { url: leftImageUrl, alt: leftAlt },
          { url: rightImageUrl, alt: rightAlt },
        ],
        componentId,
      )
      setBaseIndex(index)
    }
  }, [leftImageUrl, rightImageUrl, leftAlt, rightAlt, addImages, block._key])

  const handleLeftClick = () => {
    if (leftImageUrl) {
      const currentIndex = getImageIndex(leftImageUrl)
      if (currentIndex >= 0) {
        openSlider(currentIndex)
      }
    }
  }

  const handleRightClick = () => {
    if (rightImageUrl) {
      const currentIndex = getImageIndex(rightImageUrl)
      if (currentIndex >= 0) {
        openSlider(currentIndex)
      }
    }
  }

  if (!leftImageUrl || !rightImageUrl || baseIndex === null) return null

  return (
    <section className="w-full px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 pt-24 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="relative w-full aspect-[3/4] cursor-pointer" onClick={handleLeftClick}>
            <Image
              src={leftImageUrl || "/placeholder.svg"}
              alt={leftAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setLeftLoaded(true)}
              className={`object-cover ${leftLoaded ? "blur-0" : "blur-md"}`}
            />
          </div>
          <div className="relative w-full aspect-[3/4] cursor-pointer" onClick={handleRightClick}>
            <Image
              src={rightImageUrl || "/placeholder.svg"}
              alt={rightAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setRightLoaded(true)}
              className={`object-cover ${rightLoaded ? "blur-0" : "blur-md"}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
