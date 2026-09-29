/**
 * Shared "should this project be in search?" signal, used by both the sitemap
 * (what to submit to Google) and the project page metadata (whether to noindex).
 *
 * A project is indexable when it has real content (a written summary, any text
 * block, or at least one image) AND the editor has not hidden it via the
 * `excludeFromSearch` toggle in Sanity. So:
 *   - empty placeholder pages are kept out automatically (no thin content);
 *   - any page can be forced out by flipping the toggle, even if it has content
 *     (e.g. a published-but-unlinked project the studio doesn't want indexed).
 *
 * Both are dynamic: the sitemap revalidates hourly and the page metadata every
 * 60s, so changing content or the toggle in Sanity takes effect with no deploy.
 */

/** GROQ projection fields to spread into a `*[_type=="project"]{ ... }` query. */
export const PROJECT_CONTENT_SIGNALS = `
  "excludeFromSearch": excludeFromSearch == true,
  "hasSummary": count(builder[_type=="projectSummary" && (defined(description.ca) || defined(description.es) || defined(description.en))]) > 0,
  "textBlocks": count(builder[_type=="textBlock"]),
  "imgs": count(builder[_type in ["coverImage","monoptychImage","coverVideo","diptychImage","imageCarousel"]])
`;

export type ProjectContentSignals = {
  excludeFromSearch?: boolean;
  hasSummary?: boolean;
  textBlocks?: number;
  imgs?: number;
};

export function isProjectIndexable(p: ProjectContentSignals | null | undefined): boolean {
  if (!p) return false;
  if (p.excludeFromSearch) return false;
  return Boolean(p.hasSummary) || (p.textBlocks ?? 0) > 0 || (p.imgs ?? 0) > 0;
}
