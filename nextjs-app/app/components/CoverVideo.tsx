"use client";

import { useState, useEffect } from "react";
import { getTranslation } from "../utils/translations";
import type { CoverVideo as CoverVideoType } from "@/sanity.types";

type CoverVideoProps = {
  block: CoverVideoType;
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

export const CoverVideo = ({ block }: CoverVideoProps) => {
  const [language] = useState<"ca" | "es" | "en">("ca");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const alt = getTranslation(block.altText, language);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const embedUrl = getVimeoEmbedUrl(
    (isMobile ? block.mobileVimeoUrl : block.vimeoUrl) ?? ""
  );

  if (!embedUrl) return null;

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-white z-10" />
      <div className="absolute inset-0 z-20 transition-opacity duration-500" style={{ opacity: isLoaded ? 1 : 0 }}>
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
