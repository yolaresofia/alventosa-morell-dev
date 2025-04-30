import { client } from "@/sanity/lib/client";
import { getHomepageQuery } from "@/sanity/lib/queries";
import HomePageClient from "./components/HomePageClient";


export default async function HomePage() {
  const homepage = await client.fetch(getHomepageQuery);
  return <HomePageClient homepage={homepage} />;
}