import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { getHomepageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import HomePageClient from "./components/HomePageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";
import { getSeoText } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await client.fetch(getHomepageQuery);

  const seo = homepage?.seo as SeoFields | null;
  const title = getSeoText(seo?.seoTitle);
  const description = getSeoText(seo?.seoDescription);
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: "/" },
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function Home() {
  const [homepage, settings] = await Promise.all([
    client.fetch(getHomepageQuery),
    client.fetch(settingsQuery),
  ]);

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() ?? null : null;
  const logoAltText = settings?.logo?.altText ?? null;

  return (
    <>
      <h1 className="sr-only">Alventosa Morell Arquitectes</h1>
      <HomePageClient homepage={homepage} logoUrl={logoUrl} logoAltText={logoAltText} />
    </>
  );
}
