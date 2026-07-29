import type { LocalizedString } from "./text";

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
    menuToggle?: LocalizedString | null;
  } | null;
  projectCategories?: {
    all?: LocalizedString | null;
    uni?: LocalizedString | null;
    pluri?: LocalizedString | null;
    equip?: LocalizedString | null;
  } | null;
  projectsIndexColumns?: {
    project?: LocalizedString | null;
    program?: LocalizedString | null;
    location?: LocalizedString | null;
    area?: LocalizedString | null;
    year?: LocalizedString | null;
  } | null;
  common?: {
    viewProjects?: LocalizedString | null;
  } | null;
};
