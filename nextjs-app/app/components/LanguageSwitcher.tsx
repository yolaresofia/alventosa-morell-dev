"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALES, type Locale } from "@/app/i18n/config";
import { useLocale } from "@/app/i18n/client";

/** Replace the leading locale segment of the current pathname with `target`. Falls back to `/{target}` if the current pathname has no recognizable locale prefix. */
function replaceLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0 || !(LOCALES as readonly string[]).includes(segments[0])) {
    return `/${target}`;
  }
  segments[0] = target;
  return `/${segments.join("/")}`;
}

export default function LanguageSwitcher({
  languages,
  mobile = false,
}: {
  languages: string[];
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const otherLocales = languages.filter(
    (lang): lang is Locale =>
      (LOCALES as readonly string[]).includes(lang) && lang !== currentLocale,
  );

  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  return (
    <div
      className={`${
        mobile
          ? "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-4xl"
          : "fixed bottom-4 right-4 text-sm monitor:text-xl z-40 hidden md:flex"
      } flex items-center space-x-2`}
    >
      {otherLocales.map((lang, idx) => {
        const href = `${replaceLocaleInPath(pathname, lang)}${suffix}`;
        return (
          <div key={lang} className="flex items-center space-x-1">
            <Link
              href={href}
              hrefLang={lang}
              prefetch={false}
              className="uppercase"
              aria-label={lang}
            >
              {lang}
            </Link>
            {idx < otherLocales.length - 1 && <span>/</span>}
          </div>
        );
      })}
    </div>
  );
}
