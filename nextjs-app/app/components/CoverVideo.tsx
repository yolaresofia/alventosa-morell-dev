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
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={alt}
      />
      <span className="sr-only">{alt}</span>
    </div>
  );
};
