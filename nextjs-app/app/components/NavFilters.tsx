"use client";

import { useRouter } from "next/navigation";
import { useProjectCategory } from "@/app/context/ProjectCategoryContext";
import type { Locale } from "@/app/i18n/config";

const CATEGORY_ORDER = ["all", "uni", "pluri", "equip"] as const;
type CategoryKey = (typeof CATEGORY_ORDER)[number];

type Props = {
  locale: Locale;
  /** Localized labels for each category, keyed by CategoryKey. Pre-resolved in the server component so they ship in the initial HTML. */
  labels: Record<CategoryKey, string>;
};

/**
 * Client island for the category filter buttons. Server renders the labels and
 * order; this component just owns the click handlers and active-state styling.
 */
export default function NavFilters({ locale, labels }: Props) {
  const router = useRouter();
  const { category: selectedCategory, setCategory } = useProjectCategory();

  return (
    <div className="hidden md:flex fixed bottom-3 left-1/2 transform -translate-x-1/2 items-center gap-0.5 z-30">
      {CATEGORY_ORDER.map((key, idx) => {
        const isActive = selectedCategory === key;
        return (
          <span
            key={key}
            className="flex items-center md:text-base text-sm monitor:text-xl"
          >
            <button
              onClick={() => {
                setCategory(key as CategoryKey);
                router.push(`/${locale}/projects?cat=${key}`);
              }}
              className={`font-medium md:text-base text-sm monitor:text-xl ${
                isActive ? "text-red-500" : "text-black"
              }`}
            >
              {labels[key]}
            </button>
            {idx < CATEGORY_ORDER.length - 1 && <span>,</span>}
          </span>
        );
      })}
    </div>
  );
}
