import type React from "react";
import "./globals.css";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SanityLive } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import { toPlainText, VisualEditing } from "next-sanity";
import { handleError } from "./client-utils";
import type { Metadata } from "next";
import { LanguageProvider } from "./context/LanguageContext";
import MobileNav from "./components/MobileNav";
import Nav from "./components/Nav";
import { FilterProvider } from "./context/FilterContext";
import { ProjectCategoryProvider } from "./context/ProjectCategoryContext";
import TopLogo from "./components/TopLogo";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "./components/DisableDraftMode";
import ReactLenis from "lenis/react";
import JsonLd from "./components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(settingsQuery);

  const title = settings?.siteTitle || "Alventosa Morell";
  const description = settings?.description
    ? toPlainText(settings.description)
    : undefined;
  const ogImage = resolveOpenGraphImage(settings?.ogImage);

  // Truncate description for SEO (max 155 chars)
  const seoDescription = description
    ? description.length > 155
      ? description.slice(0, 152) + "..."
      : description
    : undefined;

  return {
    metadataBase: new URL("https://alventosamorell.com"),
    alternates: {
      canonical: "/",
    },
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: seoDescription,
    openGraph: {
      title,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
      siteName: title,
      locale: "ca_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(settingsQuery);

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() : null;
  const logoAltText = settings?.logo?.altText || null;
  const navLinks = (settings?.navLinks || [])
    .filter((link: any) => link.href && link.label)
    .map((link: any) => ({
      href: link.href,
      label: link.label,
    }));

  const languages = settings?.languages || ["ca", "es", "en"];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitectureFirm",
    name: "Alventosa Morell Arquitectes",
    url: "https://alventosamorell.com",
    ...(logoUrl && { logo: logoUrl }),
    sameAs: [] as string[],
  };

  return (
    <html lang="ca">
      <body className="font-soehne bg-white text-black overflow-x-hidden">
        <JsonLd data={organizationJsonLd} />
                <ReactLenis root>
        <ProjectCategoryProvider>
          <FilterProvider>
            <LanguageProvider>
              <SanityLive onError={handleError} />
              <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-20 sm:hidden flex items-center"></div>
              {logoUrl && <TopLogo logoUrl={logoUrl} logoAltText={logoAltText} />}
              <MobileNav navLinks={navLinks} languages={languages} />
              <nav className="sr-only" aria-label="Navegació principal">
                {navLinks.map((link: any) => (
                  <Link key={link.href} href={link.href}>{link.label?.ca || link.href}</Link>
                ))}
              </nav>
              <main className="min-h-screen flex flex-col">{children}</main>
              {(await draftMode()).isEnabled && (
                <>
                  <VisualEditing />
                  <DisableDraftMode />
                </>
              )}
              <Nav navLinks={navLinks} languages={languages} />
              <SpeedInsights />
            </LanguageProvider>
          </FilterProvider>
        </ProjectCategoryProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
