import { client } from "@/sanity/lib/client";
import { dataset, projectId } from "@/sanity/lib/api";
import { SITE_URL } from "@/app/config";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/app/i18n/config";

export const revalidate = 3600;

type LocalizedAlt = { ca?: string; es?: string; en?: string };

type ImageBlock = {
  _type: string;
  imageRef?: string;
  altText?: LocalizedAlt;
  leftImageRef?: string;
  leftAlt?: LocalizedAlt;
  rightImageRef?: string;
  rightAlt?: LocalizedAlt;
  carouselImages?: { ref?: string; alt?: LocalizedAlt }[];
};

type ProjectData = {
  title: string;
  slug: string;
  featuredImageRef?: string;
  featuredAlt?: LocalizedAlt;
  blocks: ImageBlock[];
};

function sanityRefToUrl(ref: string): string {
  // Convert: image-{hash}-{WxH}-{ext} → https://cdn.sanity.io/images/{pid}/{ds}/{hash}-{WxH}.{ext}
  const parts = ref.replace("image-", "").split("-");
  const ext = parts.pop();
  const rest = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${rest}.${ext}?w=1200&auto=format`;
}

function getAlt(altText: LocalizedAlt | undefined, locale: Locale): string {
  if (!altText) return "";
  return altText[locale] || altText[DEFAULT_LOCALE] || altText.es || altText.en || "";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type ProjectImage = { ref: string; alt?: LocalizedAlt };

function collectProjectImages(project: ProjectData): ProjectImage[] {
  const images: ProjectImage[] = [];

  if (project.featuredImageRef) {
    images.push({ ref: project.featuredImageRef, alt: project.featuredAlt });
  }

  for (const block of project.blocks ?? []) {
    if ((block._type === "coverImage" || block._type === "monoptychImage") && block.imageRef) {
      images.push({ ref: block.imageRef, alt: block.altText });
    }

    if (block._type === "diptychImage") {
      if (block.leftImageRef) images.push({ ref: block.leftImageRef, alt: block.leftAlt });
      if (block.rightImageRef) images.push({ ref: block.rightImageRef, alt: block.rightAlt });
    }

    if (block._type === "imageCarousel" && block.carouselImages) {
      for (const img of block.carouselImages) {
        if (img.ref) images.push({ ref: img.ref, alt: img.alt });
      }
    }
  }

  return images;
}

function renderProjectUrl(
  project: ProjectData,
  images: ProjectImage[],
  locale: Locale,
): string {
  const loc = `${SITE_URL}/${locale}/projects/${project.slug}`;
  const imageNodes = images
    .map((img) => {
      const url = sanityRefToUrl(img.ref);
      const caption = getAlt(img.alt, locale) || project.title;
      return `
    <image:image>
      <image:loc>${escapeXml(url)}</image:loc>
      <image:title>${escapeXml(project.title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`;
    })
    .join("");

  return `
  <url>
    <loc>${escapeXml(loc)}</loc>${imageNodes}
  </url>`;
}

export async function GET() {
  const projects = await client.fetch<ProjectData[]>(
    `*[_type == "project" && defined(slug.current)] | order(projectNumber asc) {
      title,
      "slug": slug.current,
      "featuredImageRef": featuredImage.asset._ref,
      "featuredAlt": featuredImage.altText,
      "blocks": builder[]{
        _type,
        "imageRef": image.asset._ref,
        "altText": altText,
        "leftImageRef": leftImage.asset._ref,
        "leftAlt": leftAltText,
        "rightImageRef": rightImage.asset._ref,
        "rightAlt": rightAltText,
        "carouselImages": images[]{ "ref": image.asset._ref, "alt": altText }
      }
    }`,
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const project of projects) {
    const images = collectProjectImages(project);
    if (images.length === 0) continue;

    for (const locale of LOCALES) {
      xml += renderProjectUrl(project, images, locale);
    }
  }

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
