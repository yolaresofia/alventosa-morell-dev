"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return isLocale(params?.lang) ? (params.lang as Locale) : DEFAULT_LOCALE;
}
