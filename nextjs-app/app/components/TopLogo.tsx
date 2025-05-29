"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

type Props = {
  logoUrl: string
}

export default function TopLogo({ logoUrl }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const checkVisibility = () => {
      if (document.body.classList.contains("show-top-logo")) {
        setVisible(true)
      }
    }

    checkVisibility()

    const observer = new MutationObserver(checkVisibility)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed top-0 w-full h-[60px] z-30 flex justify-center items-center px-4 transition-opacity duration-300 ease-in ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Link
        href="/"
        className="relative block w-[190px] h-[40px] md:w-[200px] md:h-[48px]"
      >
        <Image
          src={logoUrl}
          alt="Alventosa Morell Arquitectes"
          className="object-contain"
          priority
          unoptimized
          fill
        />
      </Link>
    </div>
  )
}
