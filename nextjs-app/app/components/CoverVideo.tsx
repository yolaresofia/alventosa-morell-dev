"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { localizedText } from "@/app/i18n/text";
import type { CoverVideo as CoverVideoType } from "@/sanity.types";
import type { Locale } from "@/app/i18n/config";

type CoverVideoProps = {
  block: CoverVideoType;
  locale: Locale;
  /** Vimeo thumbnail URL, painted immediately behind the iframe so the hero has a real LCP element. */
  poster?: string;
  /** Eager-load the poster (set for the above-the-fold hero) to fix LCP. */
  priority?: boolean;
};

function getVimeoEmbedUrl(vimeoUrl: string): string | null {
  try {
    const url = new URL(vimeoUrl);
    const videoId = url.pathname.split("/").filter(Boolean).pop();
    return videoId
      ? `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0`
      : null;
  } catch {
    return null;
  }
}

/**
 * Vimeo background video. Stays a client component because of the iframe load
 * fade-in and the desktop/mobile URL swap. The alt text is rendered in a
 * sr-only span so crawlers still get the localized caption.
 */
export const CoverVideo = ({ block, locale, poster, priority = false }: CoverVideoProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const alt = localizedText(block.altText, locale);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const embedUrl = getVimeoEmbedUrl(
    (isMobile ? block.mobileVimeoUrl : block.vimeoUrl) ?? "",
  );

  if (!embedUrl) return null;

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white">
      {poster ? (
        <Image
          src={poster}
          alt={alt || ""}
          fill
          sizes="100vw"
          className="object-cover z-0"
          priority={priority}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-white z-10" />
      )}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-500"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <iframe
          src={embedUrl}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full scale-[1.01]"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={alt}
        />
      </div>
      <span className="sr-only">{alt}</span>
    </div>
  );
};
