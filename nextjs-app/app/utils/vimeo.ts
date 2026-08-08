/**
 * Fetch a Vimeo video's thumbnail via the public oEmbed endpoint.
 *
 * Runs server-side (not subject to browser CSP). Used to render a fast-painting
 * poster image behind the background-video hero so there's a real LCP element
 * instead of a blank white paint while the Vimeo iframe boots.
 */
export async function getVimeoThumbnail(vimeoUrl: string): Promise<string | null> {
  if (!vimeoUrl) return null;
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`,
      { next: { revalidate: 86400 } }, // cache a day; thumbnails rarely change
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string };
    return data.thumbnail_url ?? null;
  } catch {
    return null;
  }
}
