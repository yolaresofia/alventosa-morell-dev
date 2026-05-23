import { LOCALES, DEFAULT_LOCALE } from "./config";

/** Build the `alternates.languages` map for next/metadata, including x-default. */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `/${l}${path}`;
  }
  languages["x-default"] = `/${DEFAULT_LOCALE}${path}`;
  return languages;
}
