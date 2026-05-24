"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/app/i18n/client";
import { localizedText, type LocalizedString } from "@/app/i18n/text";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";
import type { UiText } from "@/app/i18n/uiText";

type NavLink = {
  href: string;
  label: LocalizedString | string;
};

type Props = {
  navLinks: NavLink[];
  uiText?: UiText | null;
};

const CATEGORY_ORDER = ["all", "uni", "pluri", "equip"] as const;
type CategoryKey = (typeof CATEGORY_ORDER)[number];

/** True only on the projects listing route (e.g. /ca/projects). Excludes /projects/index and /projects/[slug]. */
function isProjectsListingPath(pathname: string): boolean {
  return /^\/[a-z]{2}\/projects\/?$/i.test(pathname);
}

/** True on any project detail route (e.g. /ca/projects/villa-x). Excludes /projects, /projects/index. */
function isProjectDetailPath(pathname: string): boolean {
  return /^\/[a-z]{2}\/projects\/[^/]+\/?$/i.test(pathname) && !pathname.endsWith("/index");
}

export default function Nav({ navLinks, uiText }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { category: selectedCategory, setCategory } = useProjectCategory();

  const isOnProjectsListing = isProjectsListingPath(pathname);
  const isOnProjectDetail = isProjectDetailPath(pathname);
  const shouldShowFilters = isOnProjectsListing || isOnProjectDetail;

  const categoryLabels = uiText?.projectCategories;

  return (
    <>
      <div className="hidden md:block fixed bottom-0 left-0 w-full h-11 monitor:h-14 bg-white z-30" />
      <nav className="hidden md:flex fixed bottom-3 left-6 z-40 items-center">
        {navLinks.map((link, idx) => {
          const href = `/${locale}${link.href}`;
          const isActive = pathname === href;
          const translatedLabel =
            typeof link.label === "string" ? link.label : localizedText(link.label, locale);

          return (
            <span
              key={link.href}
              className="flex items-center md:text-base text-sm monitor:text-xl"
            >
              <Link
                href={href}
                className={`md:text-base text-sm monitor:text-xl ${isActive ? "text-red-500" : ""}`}
              >
                {translatedLabel}
              </Link>
              {idx !== navLinks.length - 1 && <span>,&nbsp;</span>}
            </span>
          );
        })}
      </nav>

      {shouldShowFilters && (
        <div className="hidden md:flex fixed bottom-3 left-1/2 transform -translate-x-1/2 items-center gap-0.5 z-30">
          {CATEGORY_ORDER.map((key, idx) => {
            const label = localizedText(categoryLabels?.[key], locale);
            const isActive = selectedCategory === key;

            return (
              <span
                key={key}
                className="flex items-center md:text-base text-sm monitor:text-xl"
              >
                <button
                  onClick={() => {
                    if (!isOnProjectDetail) {
                      setCategory(key as CategoryKey);
                    }
                    router.push(`/${locale}/projects?cat=${key}`);
                  }}
                  className={`font-medium md:text-base text-sm monitor:text-xl ${
                    isActive ? "text-red-500" : "text-black"
                  } ${isOnProjectDetail ? "hover:text-red-500" : ""}`}
                >
                  {label}
                </button>
                {idx < CATEGORY_ORDER.length - 1 && <span>,</span>}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}
