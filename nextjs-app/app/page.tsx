import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { getHomepageQuery } from "@/sanity/lib/queries"; // assuming this exists
import { urlForImage } from "@/sanity/lib/utils";
import HomePageClient from "./components/HomePageClient";

export default async function Home() {
  const [{ data: homepage }, { data: settings }] = await Promise.all([
    sanityFetch({ query: getHomepageQuery }),
    sanityFetch({ query: settingsQuery }),
  ]);

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() ?? null : null;
  const logoAltText = settings?.logo?.altText ?? null;
  
  return <HomePageClient homepage={homepage} logoUrl={logoUrl} logoAltText={logoAltText} />;
}
