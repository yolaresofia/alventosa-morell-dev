import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/app/config";
import { LOCALES } from "@/app/i18n/config";
import { buildLanguageAlternates } from "@/app/i18n/metadata";
import {
  PROJECT_CONTENT_SIGNALS,
  isProjectIndexable,
  type ProjectContentSignals,
} from "@/app/utils/projectContent";

export const revalidate = 3600; // Refresh sitemap every hour

type StaticEntry = {
  /** Path without locale prefix and without leading SITE_URL (e.g. "/about", ""). */
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_ENTRIES: StaticEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects/index", changeFrequency: "weekly", priority: 0.6 },
];

function expandToLocales(
  path: string,
  lastModified: Date,
  changeFrequency: StaticEntry["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = buildLanguageAlternates(path, SITE_URL);
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch<
    ({ slug: string; _updatedAt: string } & ProjectContentSignals)[]
  >(
    `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      ${PROJECT_CONTENT_SIGNALS}
    }`,
  );

  const now = new Date();

  const staticUrls = STATIC_ENTRIES.flatMap((entry) =>
    expandToLocales(entry.path, now, entry.changeFrequency, entry.priority),
  );

  // Empty placeholder projects are left out so Google isn't fed thin content.
  const projectUrls = slugs.filter(isProjectIndexable).flatMap((p) =>
    expandToLocales(
      `/projects/${p.slug}`,
      new Date(p._updatedAt),
      "monthly",
      0.7,
    ),
  );

  return [...staticUrls, ...projectUrls];
}
