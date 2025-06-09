"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";

type LocalizedField = {
  ca?: string;
  es?: string;
  en?: string;
};

type NavLink = {
  label?: string | LocalizedField;
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
  const { language } = useLanguage();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="md:hidden">
      <div
        className="fixed top-0 right-0 h-[60px] flex items-center pr-4 z-50 cursor-pointer"
        onClick={toggleMenu}
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
      </div>
      <div
        className={`fixed inset-0 bg-white opacity-90 z-40 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2 text-4xl font-medium text-black">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const label =
              typeof link.label === "string"
                ? link.label
                : getTranslation(link.label, language);

            return (
              <Link
                key={link.href}
                href={link.href || "/"}
                className={`transition-colors ${
                  isActive ? "text-red-500" : "hover:text-red-500"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="w-full text-center mt-8">
          <LanguageSwitcher languages={languages} mobile />
        </div>
      </div>
    </div>
  );
}
