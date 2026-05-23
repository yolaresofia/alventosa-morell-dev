import type React from "react";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { handleError } from "./client-utils";
import type { Metadata } from "next";
import { FilterProvider } from "./context/FilterContext";
import { ProjectCategoryProvider } from "./context/ProjectCategoryContext";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "./components/DisableDraftMode";
import ReactLenis from "lenis/react";
import { SITE_URL } from "./config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <body className="font-soehne bg-white text-black overflow-x-hidden">
        <ReactLenis root>
          <ProjectCategoryProvider>
            <FilterProvider>
              <SanityLive onError={handleError} />
              <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-20 sm:hidden flex items-center"></div>
              <main className="min-h-screen flex flex-col">{children}</main>
              {(await draftMode()).isEnabled && (
                <>
                  <VisualEditing />
                  <DisableDraftMode />
                </>
              )}
              <SpeedInsights />
            </FilterProvider>
          </ProjectCategoryProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
