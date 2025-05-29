"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type Props = {
  logoUrl: string
}

export default function TopLogo({ logoUrl }: Props) {
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  const [visible, setVisible] = useState(!isHomepage)

  useEffect(() => {
    if (!isHomepage) {
      setVisible(true)
      return
    }

    // Reset logo visibility every time the homepage is rendered
    setVisible(false)

    const timer = setTimeout(() => {
      setVisible(true)
    }, 1100) // Match the homepage animation duration

    return () => clearTimeout(timer)
  }, [isHomepage])

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
