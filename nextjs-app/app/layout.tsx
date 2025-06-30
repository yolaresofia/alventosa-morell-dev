import type React from "react";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
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

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const title = settings?.siteTitle || "Alventosa Morell";
  const description = settings?.description
    ? toPlainText(settings.description)
    : "Default description";
  const ogImage = resolveOpenGraphImage(settings?.ogImage);

  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch (e) {
    console.error("Invalid metadataBase URL in settings", e);
  }

  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() : null;
  const navLinks = (settings?.navLinks || [])
    .filter((link) => link.href && link.label)
    .map((link) => ({
      href: link.href as string,
      label: link.label as string,
    }));

  const languages = settings?.languages || ["ca", "es", "en"];

  return (
    <html lang="ca">
      <body className="font-soehne bg-white text-black overflow-x-hidden">
        <ProjectCategoryProvider>
          <FilterProvider>
            <LanguageProvider>
              <SanityLive onError={handleError} />
              <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-20 sm:hidden flex items-center"></div>
              {logoUrl && <TopLogo logoUrl={logoUrl} />}
              <MobileNav navLinks={navLinks} languages={languages} />
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
      </body>
    </html>
  );
}
