import { cache } from "react";
import { client } from "@/sanity/lib/client";
import {
  getAboutPageQuery,
  getHomepageQuery,
  getProjectsGridQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import type { GetProjectsGridQueryResult } from "@/sanity.types";

/**
 * Per-request memoized fetchers. React.cache deduplicates identical calls within
 * the same server render so that data needed by both a layout and its pages is
 * fetched once from Sanity per user request.
 */

export const getSettings = cache(() => client.fetch(settingsQuery));

export const getHomepage = cache(() => client.fetch(getHomepageQuery));

export const getAboutPage = cache(() => client.fetch(getAboutPageQuery));

export const getProjectsGrid = cache(() =>
  client.fetch<GetProjectsGridQueryResult>(getProjectsGridQuery),
);
