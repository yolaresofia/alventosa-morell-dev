"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

type NavLink = {
  label?: string;
  href?: string;
};

export default function MobileNav({
  navLinks = [],
  languages = [],
}: {
  navLinks?: NavLink[];
  languages?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      <div
        className="md:hidden flex items-center fixed top-4 right-4 z-50 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="relative w-8 h-6">
          <span
            className={`absolute w-8 h-[1px] bg-black transition-transform duration-300 ${
              isOpen ? "rotate-45 top-2.5" : "top-2"
            }`}
          />
          <span
            className={`absolute w-8 h-[1px] bg-black transition-transform duration-300 ${
              isOpen ? "-rotate-45 top-2.5" : "top-3.5"
            }`}
          />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white/90 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-3xl font-medium text-black">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href || "/"}
                className={`transition-colors ${
                  isActive ? "text-red-500" : "hover:text-red-500"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 w-full text-center">
          <LanguageSwitcher languages={languages} />
        </div>
      </div>
    </>
  );
}
