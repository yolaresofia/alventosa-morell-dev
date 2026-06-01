"use client";

import { useEffect } from "react";

const CUSTOM_ANIMATION_DURATION = 600;
const COOLDOWN_DURATION = CUSTOM_ANIMATION_DURATION + 150;
const LARGE_DESKTOP_MIN_WIDTH = 1024;

const easeInOutCubic = (t: number, b: number, c: number, d: number): number => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
};

/**
 * Client island that adds desktop-only deck behaviour to the home page:
 *   - wheel + arrow-key navigation between featured projects
 *   - opacity dimming of non-active items
 *   - animated horizontal scroll-to-active using requestAnimationFrame
 *   - mobile-only one-off scrollTo(0,1) trick to hide the iOS URL bar
 *
 * The deck markup is server-rendered in HomePageContent; this component only
 * reads and mutates it via [data-home-deck-*] attributes.
 */
export default function HomePageScrollDeck() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-home-deck]");
    const scroller = document.querySelector<HTMLElement>("[data-home-deck-scroller]");
    if (!section || !scroller) return;

    const items = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-home-deck-item]"),
    );
    if (items.length === 0) return;

    let activeIndex = 0;
    let cooldown = false;
    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;
    let animationFrameId: number | null = null;
    let isLargeDesktop = window.innerWidth >= LARGE_DESKTOP_MIN_WIDTH;

    const applyOpacity = () => {
      if (!isLargeDesktop) {
        items.forEach((item) => (item.style.opacity = "1"));
        return;
      }
      items.forEach((item, idx) => {
        item.style.opacity = idx === activeIndex ? "1" : "0.2";
        item.style.transition = "opacity 0.3s ease";
      });
    };

    const animateScrollTo = (target: HTMLElement) => {
      if (!isLargeDesktop) return;
      const containerRect = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const startScrollLeft = scroller.scrollLeft;
      const targetScrollLeft = targetRect.left - containerRect.left + scroller.scrollLeft;

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const next = easeInOutCubic(
          elapsed,
          startScrollLeft,
          targetScrollLeft - startScrollLeft,
          CUSTOM_ANIMATION_DURATION,
        );
        scroller.scrollLeft = next;
        if (elapsed < CUSTOM_ANIMATION_DURATION) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          scroller.scrollLeft = targetScrollLeft;
          animationFrameId = null;
        }
      };
      animationFrameId = requestAnimationFrame(step);
    };

    const goTo = (newIndex: number) => {
      if (newIndex === activeIndex) return;
      if (newIndex < 0 || newIndex >= items.length) return;
      cooldown = true;
      activeIndex = newIndex;
      applyOpacity();
      animateScrollTo(items[newIndex]);
      if (cooldownTimer) clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(() => {
        cooldown = false;
      }, COOLDOWN_DURATION);
    };

    const onWheel = (event: WheelEvent) => {
      if (!isLargeDesktop) return;
      if (!section.contains(event.target as Node)) return;
      event.preventDefault();
      if (cooldown) return;
      if (event.deltaY > 1) goTo(activeIndex + 1);
      else if (event.deltaY < -1) goTo(activeIndex - 1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isLargeDesktop) return;
      if (cooldown) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    };

    const onResize = () => {
      const next = window.innerWidth >= LARGE_DESKTOP_MIN_WIDTH;
      if (next === isLargeDesktop) return;
      isLargeDesktop = next;
      applyOpacity();
    };

    // initial paint of opacities
    applyOpacity();

    // hide URL bar on mobile after first paint
    if (!isLargeDesktop) {
      const t = setTimeout(() => window.scrollTo(0, 1), 100);
      // cleanup handled below; t is captured by closure but inert
      void t;
    }

    // hide the scrollbar globally while this component is mounted
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(styleEl);

    section.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      section.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (cooldownTimer) clearTimeout(cooldownTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  return null;
}
