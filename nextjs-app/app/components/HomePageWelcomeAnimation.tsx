"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  logoUrl: string;
  logoAlt: string;
};

const LARGE_DESKTOP_MIN_WIDTH = 1024;
const SESSION_KEY = "welcomeAnimationShown";
const HOLD_DURATION_MS = 1000;
const FADE_OUT_DELAY_MS = 20;

/**
 * One-shot welcome overlay shown the first time a desktop visitor lands on the
 * home page (per session). Renders nothing if not large-desktop or the session
 * flag is already set, so it has no SEO impact. The overlay markup is created
 * by this client component (it would just be hidden noise in the static HTML).
 */
export default function HomePageWelcomeAnimation({ logoUrl, logoAlt }: Props) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.innerWidth < LARGE_DESKTOP_MIN_WIDTH) return;
    if (sessionStorage.getItem(SESSION_KEY) === "true") return;

    setVisible(true);
    const holdTimer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "true");
      setFading(true);
      setTimeout(() => setVisible(false), 850); // matches the longest transition
    }, HOLD_DURATION_MS);

    return () => clearTimeout(holdTimer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-white z-40 pointer-events-none"
        style={{
          opacity: fading ? 0 : 0.85,
          transition: `opacity 0.8s ease-out ${FADE_OUT_DELAY_MS}ms`,
        }}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          opacity: fading ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      >
        <Image
          src={logoUrl}
          alt={logoAlt}
          width={600}
          height={200}
          className="w-[80%] max-w-[600px] h-auto object-contain mix-blend-multiply"
          unoptimized
          priority
        />
      </div>
    </>
  );
}
