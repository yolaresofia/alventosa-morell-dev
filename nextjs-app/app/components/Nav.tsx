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

/** True only on the projects listing route (e.g. /ca/projects). Excludes /projects/index and /projects/[slug]. */
function isProjectsListingPath(pathname: string): boolean {
  return /^\/[a-z]{2}\/projects\/?$/i.test(pathname);
}

/** True on any project detail route (e.g. /ca/projects/villa-x). Excludes /projects, /projects/index. */
function isProjectDetailPath(pathname: string): boolean {
  return /^\/[a-z]{2}\/projects\/[^/]+\/?$/i.test(pathname) && !pathname.endsWith("/index");
}

/**
 * Server component that pre-renders desktop nav links so they ship in the
 * initial HTML for crawlers. The category filter buttons (which need router and
 * context) live in NavFilters, a small client island.
 */
export default function Nav({ navLinks, uiText, locale, pathname }: Props) {
  const isOnProjectsListing = isProjectsListingPath(pathname);
  const isOnProjectDetail = isProjectDetailPath(pathname);
  const shouldShowFilters = isOnProjectsListing || isOnProjectDetail;

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
        <NavFilters
          locale={locale}
          labels={resolvedFilterLabels}
          isOnProjectDetail={isOnProjectDetail}
        />
      )}
    </>
  );
}
