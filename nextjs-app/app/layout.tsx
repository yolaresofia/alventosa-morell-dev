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
import { getLocaleFromHeaders } from "./i18n/server";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleFromHeaders();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Warm up connections to Vimeo so the background-video heroes on project pages boot faster. */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" crossOrigin="" />
        {/* Welcome overlay gate. Runs before the body paints. The overlay is shown
            by default via CSS (desktop only), so it never flashes in after the
            page. This script only HIDES it — for repeat views in the session — by
            marking <html> before first paint, and marks it "seen" ~2s after a
            first view so client-side navigation back home doesn't replay it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=location.pathname;if(!(p==='/'||/^\\/(ca|es|en)\\/?$/.test(p)))return;var h=document.documentElement;if(sessionStorage.getItem('welcomeAnimationShown')==='true'){h.classList.add('welcome-seen');}else{sessionStorage.setItem('welcomeAnimationShown','true');setTimeout(function(){h.classList.add('welcome-seen');},2000);}}catch(e){}})();",
          }}
        />
        {/* Critical CSS for the welcome overlay, inline so it applies on the very
            first paint. It must NOT live only in globals.css: in dev that stylesheet
            is injected by JS, which would let the page paint before the overlay is
            styled (the flash). Inline in <head> it is render-blocking and present
            from frame one, in dev and prod alike. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".welcome-overlay{position:fixed;inset:0;z-index:50;display:none;background-color:rgba(255,255,255,.85);background-repeat:no-repeat;background-position:center;background-size:min(80%,600px) auto;pointer-events:none}" +
              "@media(min-width:1024px){.welcome-overlay{display:block;background-image:var(--welcome-logo);animation:welcome-fade 1.8s ease-out forwards}}" +
              "html.welcome-seen .welcome-overlay{display:none}" +
              "@keyframes welcome-fade{0%,55%{opacity:1}100%{opacity:0;visibility:hidden}}" +
              "@media(prefers-reduced-motion:reduce) and (min-width:1024px){.welcome-overlay{animation-duration:.9s}}" +
              // Deck dimming, applied on the first paint so non-active projects
              // start faded (desktop) instead of appearing full and being dimmed
              // by JS after hydration (the white flash on the images). The deck
              // script then keeps this in sync via inline styles, which win.
              "@media(min-width:1024px){[data-home-deck-item]{opacity:.2;transition:opacity .3s ease}[data-home-deck-item]:first-child{opacity:1}}" +
              // Phone in landscape (wide but short) lands in Tailwind's `md` range
              // and would otherwise get the tablet filmstrip. Target it by height:
              // one project per screen, image fills, title stays visible — like the
              // portrait mobile card. Higher-specificity selectors beat the md rules.
              "@media(orientation:landscape) and (max-height:600px) and (min-width:768px){" +
              "[data-home-deck]{height:100svh}" +
              "[data-home-deck] [data-home-deck-item]{width:100vw;height:100svh}" +
              "[data-home-deck] [data-home-deck-item]>div:first-child{width:100vw;height:auto;flex:1 1 0%;min-height:0}" +
              "[data-home-deck] [data-home-deck-item] img{width:100%;height:100%;object-fit:cover}}" +
              // Smaller mobile-menu type when the phone is in landscape (short).
              "@media (orientation:landscape) and (max-height:600px){[data-mobile-menu]{font-size:1.5rem;line-height:2rem}[data-mobile-menu]>*+*{margin-top:.25rem}}",
          }}
        />
      </head>
      <body className="font-soehne bg-white text-black overflow-x-hidden">
        <ReactLenis root>
          <ProjectCategoryProvider>
            <FilterProvider>
              <SanityLive onError={handleError} />
              <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-20 sm:hidden flex items-center"></div>
              <main className="min-h-[100dvh] flex flex-col">{children}</main>
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
