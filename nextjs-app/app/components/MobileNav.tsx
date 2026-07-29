import { localizedText, type LocalizedString } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNavLink from "./MobileNavLink";
import MobileNavShell from "./MobileNavShell";

type NavLink = {
  label?: string | LocalizedString;
  href?: string;
};

type Props = {
  navLinks?: NavLink[];
  languages?: string[];
  locale: Locale;
  /** Current request pathname (passed from the layout so this component stays sync). */
  pathname: string;
  /** Localized aria-label for the menu toggle button, e.g. "Menú". */
  toggleLabel: string;
};

/**
 * Server component that pre-renders all nav links so their labels and hrefs are
 * in the initial HTML for SEO. The open/close interaction lives in
 * MobileNavShell (a small client island).
 */
export default function MobileNav({
  navLinks = [],
  languages = [],
  locale,
  pathname,
  toggleLabel,
}: Props) {
  return (
    <MobileNavShell
      toggleLabel={toggleLabel}
      languageSwitcher={
        <LanguageSwitcher
          languages={languages}
          currentLocale={locale}
          pathname={pathname}
          mobile
        />
      }
    >
      {navLinks.map((link) => {
        const href = link.href ? `/${locale}${link.href}` : `/${locale}`;
        const label =
          typeof link.label === "string"
            ? link.label
            : localizedText(link.label, locale);

        return <MobileNavLink key={href} href={href} label={label} isActive={pathname === href} />;
      })}
    </MobileNavShell>
  );
}
