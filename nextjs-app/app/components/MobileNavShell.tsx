"use client";

import { useState, type ReactNode } from "react";

type Props = {
  /** Server-rendered nav links (one MobileNavLink per item). */
  children: ReactNode;
  /** Server-rendered LanguageSwitcher (passed in so it stays in the initial HTML). */
  languageSwitcher: ReactNode;
  /** Localized aria-label for the toggle button. */
  toggleLabel: string;
};

/**
 * Client wrapper that owns the open/close state of the mobile menu. The link
 * list and the language switcher are passed in (server-rendered) so their
 * labels and hrefs ship in the initial HTML for crawlers; only the open/close
 * interaction runs on the client.
 */
export default function MobileNavShell({ children, languageSwitcher, toggleLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={toggleLabel}
        aria-expanded={isOpen}
        onClick={toggleMenu}
        className="fixed top-0 right-0 h-[60px] flex items-center pr-6 pr-[max(1.5rem,env(safe-area-inset-right))] z-50 cursor-pointer bg-transparent border-0"
      >
        <div className="relative w-8 h-6">
          <span
            className={`absolute w-8 h-[1px] bg-black transition-transform duration-300 ${
              isOpen ? "rotate-45 top-2.5" : "top-2"
            }`}
            style={{ zIndex: 50 }}
          />
          <span
            className={`absolute w-8 h-[1px] bg-black transition-transform duration-300 ${
              isOpen ? "-rotate-45 top-2.5" : "top-3.5"
            }`}
            style={{ zIndex: 50 }}
          />
        </div>
      </button>
      <div
        className={`fixed inset-0 bg-white opacity-90 z-40 ${isOpen ? "block" : "hidden"}`}
        onClick={closeMenu}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2 text-4xl [@media(orientation:landscape)and(max-height:600px)]:text-2xl [@media(orientation:landscape)and(max-height:600px)]:space-y-1 font-medium text-black">
          {children}
        </div>
        <div className="w-full text-center mt-8">{languageSwitcher}</div>
      </div>
    </div>
  );
}
