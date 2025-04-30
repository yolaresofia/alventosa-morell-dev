import { client } from "@/sanity/lib/client";
import { getAboutPageQuery } from "@/sanity/lib/queries";
import AboutPageClient from "../components/AboutPageClient";

export default async function AboutPage() {
  const about = await client.fetch(getAboutPageQuery);

  return <AboutPageClient about={about} />;
}
