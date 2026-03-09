import { client } from "@/sanity/lib/client";
import { getAboutPageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import AboutPageClient from "../components/AboutPageClient";
import type { Metadata } from "next";
import type { SeoFields } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch(getAboutPageQuery);
  const seo = about?.seo as SeoFields | null;

  const title = seo?.seoTitle || "Sobre Nosaltres";
  const description = seo?.seoDescription || undefined;
  const ogImage = resolveOpenGraphImage(seo?.seoImage);

  return {
    title,
    ...(description && { description }),
    alternates: { canonical: "/about" },
    openGraph: {
      title,
      ...(description && { description }),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function AboutPage() {
  const about = await client.fetch(getAboutPageQuery);

  return (
    <>
      <h1 className="sr-only">Sobre Nosaltres — Alventosa Morell Arquitectes</h1>
      <AboutPageClient about={about} />
    </>
  );
}
