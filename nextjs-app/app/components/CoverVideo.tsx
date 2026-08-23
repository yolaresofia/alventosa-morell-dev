"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

/** Run a callback when the browser is idle, falling back to a short timeout. */
function whenIdle(cb: () => void): () => void {
  const w = window as typeof window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(cb, { timeout: 2000 });
    return () => w.cancelIdleCallback?.(id);
  }
  const t = setTimeout(cb, 200);
  return () => clearTimeout(t);
}

/**
 * Vimeo background video. Stays a client component because of the iframe load
 * fade-in and the desktop/mobile URL swap. The alt text is rendered in a
 * sr-only span so crawlers still get the localized caption.
 *
 * The iframe boots lazily so it never competes with the LCP: the hero
 * (priority) waits until the page has loaded and the browser is idle — the
 * poster is the LCP element and paints first — while non-hero videos wait until
 * they scroll near the viewport. Until then only the poster is on screen.
 */
export const CoverVideo = ({ block, locale, poster, priority = false }: CoverVideoProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const alt = localizedText(block.altText, locale);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Decide when to actually load the iframe.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Non-hero: only boot when it scrolls near the viewport.
    if (!priority) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setShouldLoad(true);
            io.disconnect();
          }
        },
        { rootMargin: "200px" },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    // Hero: let the poster paint as the LCP, then boot once the page is idle.
    let cancelIdle: (() => void) | undefined;
    const start = () => {
      cancelIdle = whenIdle(() => setShouldLoad(true));
    };
    if (document.readyState === "complete") {
      start();
      return () => cancelIdle?.();
    }
    window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      cancelIdle?.();
    };
  }, [priority]);

  const embedUrl = getVimeoEmbedUrl(
    (isMobile ? block.mobileVimeoUrl : block.vimeoUrl) ?? "",
  );

  if (!embedUrl) return null;

  return (
    <div ref={containerRef} className="w-full h-screen relative overflow-hidden bg-white">
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
      {shouldLoad && (
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
      )}
      <span className="sr-only">{alt}</span>
    </div>
  );
};
