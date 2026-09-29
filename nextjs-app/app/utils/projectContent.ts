/**
 * Shared "should this project be in search?" signal, used by both the sitemap
 * (what to submit to Google) and the project page metadata (whether to noindex).
 *
 * A project is indexable when it has real content (a written summary, any text
 * block, or at least one image) AND the editor's `showInSearch` toggle is on. So:
 *   - empty placeholder pages are kept out automatically (no thin content);
 *   - any page can be hidden by turning the toggle OFF, even if it has content
 *     (e.g. a published-but-unlinked project the studio doesn't want indexed).
 *
 * `showInSearch` defaults to ON (initialValue true; an unset value is treated as
 * on), so nothing disappears from search by accident — the toggle only matters
 * when explicitly switched off.
 *
 * Both uses are dynamic: the sitemap revalidates hourly and the page metadata
 * every 60s, so changing content or the toggle in Sanity takes effect with no
 * deploy.
 */

/** GROQ projection fields to spread into a `*[_type=="project"]{ ... }` query. */
export const PROJECT_CONTENT_SIGNALS = `
  "showInSearch": showInSearch != false,
  "hasSummary": count(builder[_type=="projectSummary" && (defined(description.ca) || defined(description.es) || defined(description.en))]) > 0,
  "textBlocks": count(builder[_type=="textBlock"]),
  "imgs": count(builder[_type in ["coverImage","monoptychImage","coverVideo","diptychImage","imageCarousel"]])
`;

export type ProjectContentSignals = {
  /** true unless the editor explicitly turned the toggle off (unset counts as on). */
  showInSearch?: boolean;
  hasSummary?: boolean;
  textBlocks?: number;
  imgs?: number;
};

export function isProjectIndexable(p: ProjectContentSignals | null | undefined): boolean {
  if (!p) return false;
  if (p.showInSearch === false) return false;
  return Boolean(p.hasSummary) || (p.textBlocks ?? 0) > 0 || (p.imgs ?? 0) > 0;
}
