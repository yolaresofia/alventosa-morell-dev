"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";

type LocalizedField = {
  ca?: string;
  es?: string;
  en?: string;
};

type NavLink = {
  href: string;
  label: LocalizedField | string;
};

type Props = {
  navLinks: NavLink[];
  languages: string[];
  currentProjectCategory?: string;
};

const categoryLabels: Record<string, LocalizedField> = {
  all: { ca: "Tots", es: "Todos", en: "All" },
  uni: { ca: "Unifamiliar", es: "Unifamiliar", en: "Single-family" },
  pluri: { ca: "Plurifamiliar", es: "Plurifamiliar", en: "Multi-family" },
  equip: { ca: "Equipaments", es: "Equipamientos", en: "Facilities" },
};

const categories = [
  { value: "all" },
  { value: "uni" },
  { value: "pluri" },
  { value: "equip" },
];

export default function Nav({
  navLinks,
  languages = [],
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { category: selectedCategory, setCategory } = useProjectCategory();
  const availableLanguages = languages.filter((lang) => lang !== language);

  const isProjectDetailPage =
    pathname.startsWith("/projects/") &&
    pathname !== "/projects" &&
    pathname !== "/projects/index";

  const shouldShowFilters =
    (pathname === "/projects" || pathname.startsWith("/projects/")) &&
    pathname !== "/projects/index";

  return (
    <>
      {shouldShowFilters && (
        <div className="fixed bottom-0 left-0 w-full h-11 bg-white z-30" />
      )}
      <nav className="hidden md:flex fixed bottom-3 left-6 z-40 text-sm items-center">
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

      {shouldShowFilters && (
        <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-0.5 z-30 text-sm">
          {categories.map((cat, idx) => {
            const label = getTranslation(categoryLabels[cat.value], language);
            const isActive = selectedCategory === cat.value;

            return (
              <span key={cat.value} className="flex items-center">
                <button
                  onClick={() => {
                    if (!isProjectDetailPage) {
                      setCategory(cat.value as typeof selectedCategory);
                      router.push(`/projects?cat=${cat.value}`);
                    }
                  }}
                  disabled={isProjectDetailPage}
                  className={`font-medium ${
                    isActive ? "text-red-500" : "text-black"
                  } ${isProjectDetailPage ? "cursor-default" : "hover:text-red-500"}`}
                >
                  {label}
                </button>
                {idx < categories.length - 1 && <span>,</span>}
              </span>
            );
          })}
        </div>
      )}
      <div className="fixed bottom-3 right-6 items-center space-x-1 text-sm z-40 hidden md:flex">
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
