"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  /** Whether the logo should start hidden and fade in after a delay (homepage only). */
  delayedReveal: boolean;
  children: ReactNode;
};

/**
 * Client island that owns the homepage fade-in for the top logo. On other
 * routes it just renders the children visible. The actual logo image and link
 * are server-rendered (passed in as children) so they ship in the initial HTML.
 */
export default function TopLogoVisibility({ delayedReveal, children }: Props) {
  const [visible, setVisible] = useState(!delayedReveal);

  useEffect(() => {
    if (!delayedReveal) {
      setVisible(true);
      return;
    }
    setVisible(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 1100);

    return () => clearTimeout(timer);
  }, [delayedReveal]);

  return (
    <div
      className={`fixed top-0 w-full h-[60px] z-30 flex justify-center items-center px-4 transition-opacity duration-300 ease-in ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
