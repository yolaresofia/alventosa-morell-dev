import { client } from "@/sanity/lib/client";
import { dataset, projectId } from "@/sanity/lib/api";

export const revalidate = 3600;

const SITE_URL = "https://www.alventosamorell.com";

type ImageBlock = {
  _type: string;
  imageRef?: string;
  altText?: { ca?: string; es?: string; en?: string };
  leftImageRef?: string;
  leftAlt?: { ca?: string; es?: string; en?: string };
  rightImageRef?: string;
  rightAlt?: { ca?: string; es?: string; en?: string };
  carouselImages?: { ref?: string; alt?: { ca?: string; es?: string; en?: string } }[];
};

type ProjectData = {
  title: string;
  slug: string;
  featuredImageRef?: string;
  featuredAlt?: { ca?: string; es?: string; en?: string };
  blocks: ImageBlock[];
};

function sanityRefToUrl(ref: string): string {
  // Convert: image-{hash}-{WxH}-{ext} → https://cdn.sanity.io/images/{pid}/{ds}/{hash}-{WxH}.{ext}
  const parts = ref.replace("image-", "").split("-");
  const ext = parts.pop();
  const rest = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${rest}.${ext}?w=1200&auto=format`;
}

function getAlt(altText?: { ca?: string; es?: string; en?: string }): string {
  if (!altText) return "";
  return altText.ca || altText.es || altText.en || "";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    }`
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  for (const project of projects) {
    const images: { url: string; title: string; caption: string }[] = [];

    // Featured image
    if (project.featuredImageRef) {
      images.push({
        url: sanityRefToUrl(project.featuredImageRef),
        title: `${project.title}`,
        caption: getAlt(project.featuredAlt) || project.title,
      });
    }

    // Builder block images
    if (project.blocks) {
      for (const block of project.blocks) {
        if (block._type === "coverImage" && block.imageRef) {
          images.push({
            url: sanityRefToUrl(block.imageRef),
            title: project.title,
            caption: getAlt(block.altText) || project.title,
          });
        }

        if (block._type === "monoptychImage" && block.imageRef) {
          images.push({
            url: sanityRefToUrl(block.imageRef),
            title: project.title,
            caption: getAlt(block.altText) || project.title,
          });
        }

        if (block._type === "diptychImage") {
          if (block.leftImageRef) {
            images.push({
              url: sanityRefToUrl(block.leftImageRef),
              title: project.title,
              caption: getAlt(block.leftAlt) || project.title,
            });
          }
          if (block.rightImageRef) {
            images.push({
              url: sanityRefToUrl(block.rightImageRef),
              title: project.title,
              caption: getAlt(block.rightAlt) || project.title,
            });
          }
        }

        if (block._type === "imageCarousel" && block.carouselImages) {
          for (const img of block.carouselImages) {
            if (img.ref) {
              images.push({
                url: sanityRefToUrl(img.ref),
                title: project.title,
                caption: getAlt(img.alt) || project.title,
              });
            }
          }
        }
      }
    }

    if (images.length === 0) continue;

    xml += `
  <url>
    <loc>${SITE_URL}/projects/${escapeXml(project.slug)}</loc>`;

    for (const img of images) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`;
    }

    xml += `
  </url>`;
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