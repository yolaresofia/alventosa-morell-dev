import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // Refresh sitemap every hour

const SITE_URL = "https://alventosamorell.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`
  );

  const projectUrls: MetadataRoute.Sitemap = slugs.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects/index`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...projectUrls,
  ];
}
