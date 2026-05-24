import { LOCALES, DEFAULT_LOCALE } from "./config";

/** Build the `alternates.languages` map for next/metadata, including x-default. Pass an `origin` (e.g. SITE_URL) for absolute URLs (sitemap); omit it for relative paths (per-page metadata). */
export function buildLanguageAlternates(
  path: string,
  origin = "",
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${origin}/${l}${path}`;
  }
  languages["x-default"] = `${origin}/${DEFAULT_LOCALE}${path}`;
  return languages;
}
