"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getTranslation } from "../utils/translations"
import { useLanguage } from "../context/LanguageContext"
import { urlForImage } from "@/sanity/lib/utils"
import type { CoverImage as CoverImageType } from "@/sanity.types"

type CoverImageProps = {
  block: CoverImageType
}

export const CoverImage = ({ block }: CoverImageProps) => {
  const { language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  const alt = getTranslation(block.altText, language)
  const bottomText = getTranslation(block.bottomText, language)
  const desktopImageUrl = block.image ? urlForImage(block.image)?.width(1920).url() : undefined
  const mobileImageUrl = block.mobileImage ? urlForImage(block.mobileImage)?.width(828).url() : undefined
  const hasPadding = block.hasPadding || false

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const imageUrl = isMobile && mobileImageUrl ? mobileImageUrl : desktopImageUrl

  if (!imageUrl) return null

  const containerClass = hasPadding ? "w-full py-32" : "w-full h-screen"

  return (
    <div className={containerClass}>
      <div className="relative w-full h-screen">
        <Image
          src={imageUrl}
          alt={alt || ""}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      {bottomText && (
        <div className="pt-4 px-6">
         <p className="max-w-5xl md:text-base text-sm monitor:text-xl text-black font-medium leading-[1.5] mb-16">{bottomText}</p>
        </div>
      )}
    </div>
  )
}