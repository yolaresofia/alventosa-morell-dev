import { localizedText, type LocalizedString } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import type { UiText } from "@/app/i18n/uiText";
import NavLink from "./NavLink";
import NavFilters from "./NavFilters";

type NavLinkItem = {
  href: string;
  label: LocalizedString | string;
};

type Props = {
  navLinks: NavLinkItem[];
  uiText?: UiText | null;
  locale: Locale;
  /** Current request pathname (passed from the layout so this component stays sync). */
  pathname: string;
};

const CATEGORY_ORDER = ["all", "uni", "pluri", "equip"] as const;
type CategoryKey = (typeof CATEGORY_ORDER)[number];

/** True on the projects grid route (e.g. /ca/projects) or the projects index route (/ca/projects/index). Excludes /projects/[slug]. */
function shouldShowCategoryFilters(pathname: string): boolean {
  return (
    /^\/[a-z]{2}\/projects\/?$/i.test(pathname) ||
    /^\/[a-z]{2}\/projects\/index\/?$/i.test(pathname)
  );
}

/**
 * Server component that pre-renders desktop nav links so they ship in the
 * initial HTML for crawlers. The category filter buttons (which need router and
 * context) live in NavFilters, a small client island.
 */
export default function Nav({ navLinks, uiText, locale, pathname }: Props) {
  const shouldShowFilters = shouldShowCategoryFilters(pathname);

  const categoryLabels = uiText?.projectCategories;
  const resolvedFilterLabels = CATEGORY_ORDER.reduce(
    (acc, key) => {
      acc[key] = localizedText(categoryLabels?.[key], locale) || key;
      return acc;
    },
    {} as Record<CategoryKey, string>,
  );

  return (
    <>
      <div className="hidden md:block fixed bottom-0 left-0 w-full h-11 monitor:h-14 bg-white z-30" />
      <nav className="hidden md:flex fixed bottom-3 left-6 z-40 items-center">
        {navLinks.map((link, idx) => {
          const href = `/${locale}${link.href}`;
          const isActive = pathname === href;
          const label =
            typeof link.label === "string" ? link.label : localizedText(link.label, locale);

          return (
            <NavLink
              key={link.href}
              href={href}
              label={label}
              isActive={isActive}
              isLast={idx === navLinks.length - 1}
            />
          );
        })}
      </nav>

      {shouldShowFilters && (
        <NavFilters locale={locale} labels={resolvedFilterLabels} />
      )}
    </>
  );
}
