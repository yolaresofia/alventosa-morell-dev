/**
 * Shared "does this project have real content?" signal, used by both the sitemap
 * (to decide what to submit to Google) and the project page metadata (to noindex
 * empty pages). A project counts as indexable if it has a written summary, any
 * text block, or at least one image. Empty placeholder projects are therefore
 * kept out of the sitemap AND marked noindex, so Google isn't fed thin content.
 *
 * This is self-correcting: the moment content is added in Sanity, the project
 * becomes indexable again with no code change.
 */

/** GROQ projection fields to spread into a `*[_type=="project"]{ ... }` query. */
export const PROJECT_CONTENT_SIGNALS = `
  "hasSummary": count(builder[_type=="projectSummary" && (defined(description.ca) || defined(description.es) || defined(description.en))]) > 0,
  "textBlocks": count(builder[_type=="textBlock"]),
  "imgs": count(builder[_type in ["coverImage","monoptychImage","coverVideo","diptychImage","imageCarousel"]])
`;

export type ProjectContentSignals = {
  hasSummary?: boolean;
  textBlocks?: number;
  imgs?: number;
};

export function isProjectIndexable(p: ProjectContentSignals | null | undefined): boolean {
  if (!p) return false;
  return Boolean(p.hasSummary) || (p.textBlocks ?? 0) > 0 || (p.imgs ?? 0) > 0;
}
