"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";

type LocalizedField = {
  ca?: string;
  es?: string;
  en?: string;
};

type NavLink = {
  href: string;
  label: LocalizedField | string; // handle legacy flat strings just in case
};

type Props = {
  navLinks: NavLink[];
  languages: string[];
};

const categoryLabels: Record<string, LocalizedField> = {
  all: {
    ca: "Tots",
    es: "Todos",
    en: "All",
  },
  uni: {
    ca: "Unifamiliar",
    es: "Unifamiliar",
    en: "Single-family",
  },
  pluri: {
    ca: "Plurifamiliar",
    es: "Plurifamiliar",
    en: "Multi-family",
  },
  equip: {
    ca: "Equipaments",
    es: "Equipamientos",
    en: "Facilities",
  },
};

const categories = [
  { value: "all" },
  { value: "uni" },
  { value: "pluri" },
  { value: "equip" },
];

export default function Nav({ navLinks, languages = [] }: Props) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const availableLanguages = languages.filter((lang) => lang !== language);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const shouldShowFilters =
    (pathname === "/projects" || pathname?.startsWith("/projects/")) &&
    pathname !== "/projects/index";

  return (
    <>
      {shouldShowFilters && (
        <div className="fixed bottom-0 left-0 w-full h-11 bg-white z-30" />
      )}

      {/* Navigation links */}
      <nav className="hidden md:flex fixed bottom-3 left-4 z-40 text-sm items-center">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href;
          const translatedLabel =
            typeof link.label === "string"
              ? link.label
              : getTranslation(link.label, language);

          return (
            <span key={idx} className="flex items-center">
              <Link
                href={link.href}
                className={`hover:underline ${isActive ? "text-red-500" : ""}`}
              >
                {translatedLabel}
              </Link>
              {idx !== navLinks.length - 1 && <span>,&nbsp;</span>}
            </span>
          );
        })}
      </nav>

      {/* Filter buttons */}
      {shouldShowFilters && (
        <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-0.5 z-40 text-sm">
          {categories.map((cat, idx) => {
            const label =
              categoryLabels[cat.value] &&
              getTranslation(categoryLabels[cat.value], language);

            return (
              <span key={cat.value} className="flex items-center">
                <button
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? "text-red-500"
                      : "text-black hover:text-red-500"
                  }`}
                >
                  {label}
                </button>
                {idx < categories.length - 1 && <span>,</span>}
              </span>
            );
          })}
        </div>
      )}

      {/* Language switcher */}
      <div className="fixed bottom-3 right-4 items-center space-x-1 text-sm z-40 hidden md:flex">
        {availableLanguages.map((lang, idx) => (
          <div key={lang} className="flex items-center space-x-1">
            <button
              className="hover:underline uppercase"
              onClick={() => setLanguage(lang as "ca" | "es" | "en")}
            >
              {lang}
            </button>
            {idx < availableLanguages.length - 1 && <span>/</span>}
          </div>
        ))}
      </div>
    </>
  );
}
