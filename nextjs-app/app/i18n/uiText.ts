import type { LocalizedString } from "@/sanity/lib/types";
import type { Locale } from "./config";

export type UiText = {
  notFound?: {
    pageTitle?: LocalizedString | null;
    projectTitle?: LocalizedString | null;
    projectDescription?: LocalizedString | null;
  } | null;
  pageTitles?: {
    home?: LocalizedString | null;
    about?: LocalizedString | null;
    projects?: LocalizedString | null;
    projectsIndex?: LocalizedString | null;
  } | null;
  navigation?: {
    home?: LocalizedString | null;
    projects?: LocalizedString | null;
    projectsIndex?: LocalizedString | null;
    about?: LocalizedString | null;
    allProjects?: LocalizedString | null;
  } | null;
  projectCategories?: {
    all?: LocalizedString | null;
    uni?: LocalizedString | null;
    pluri?: LocalizedString | null;
    equip?: LocalizedString | null;
  } | null;
  common?: {
    viewProjects?: LocalizedString | null;
  } | null;
};

/** Read a localized string with locale → ca → es → en fallback chain. Returns empty string when missing. */
export function uiString(
  field: LocalizedString | null | undefined,
  locale: Locale,
): string {
  if (!field) return "";
  return field[locale] || field.ca || field.es || field.en || "";
}
