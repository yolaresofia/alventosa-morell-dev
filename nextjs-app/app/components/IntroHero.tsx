"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IntroHero as IntroHeroType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

type IntroHeroProps = {
  block: IntroHeroType;
};

export default function IntroHero({ block }: IntroHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [shuffledDesktopImages, setShuffledDesktopImages] = useState<any[]>([]);
  const [shuffledMobileImages, setShuffledMobileImages] = useState<any[]>([]);
  const router = useRouter();

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (block.desktopBackgroundImages) {
      setShuffledDesktopImages(shuffleArray(block.desktopBackgroundImages));
    }
    if (block.mobileBackgroundImages) {
      setShuffledMobileImages(shuffleArray(block.mobileBackgroundImages));
    }
  }, [block.desktopBackgroundImages, block.mobileBackgroundImages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const images =
      shuffledMobileImages.length > 0 ? shuffledMobileImages : shuffledDesktopImages;
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile, shuffledMobileImages, shuffledDesktopImages]);

  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledDesktopImages.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + shuffledDesktopImages.length) % shuffledDesktopImages.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, shuffledDesktopImages]);

  console.log("Logo URL:", urlForImage(block?.logo)?.url());

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const logoElement = document.getElementById("hero-logo");
      if (logoElement && logoElement.contains(e.target as Node)) {
        router.push("/about");
      } else {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledDesktopImages.length);
      }
    },
    [isMobile, shuffledDesktopImages.length, router]
  );

  if (!block) return null;

  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      onClick={handleClick}
    >
      <div className="absolute inset-0 w-full h-full hidden md:block">
        {shuffledDesktopImages.map((img, index) => (
          <Image
            key={index}
            src={urlForImage(img?.image)?.url() as string}
            alt={img.altText || "Background image"}
            fill
            className={`absolute w-full h-full object-cover object-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="absolute inset-0 w-full h-full block md:hidden">
        {shuffledMobileImages.map((img, index) => (
          <Image
            key={index}
            src={urlForImage(img?.image)?.url() as string}
            alt={img.altText || "Background image"}
            fill
            className={`absolute w-full h-full object-cover object-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/15"></div>

      {block.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          id="hero-logo"
          src={urlForImage(block?.logo)?.url() as string}
          alt={block?.logoAltText?.toString() || "Logo"}
          onClick={() => router.push("/about")}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer md:w-[550px] w-[350px] h-auto"
        />
      )}
    </section>
  );
}
