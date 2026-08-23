import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { localizedText, type LocalizedString } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import HomePageScrollDeck from "./HomePageScrollDeck";

type Props = {
  homepage: any;
  logoUrl: string | null;
  logoAltText?: LocalizedString | null;
  locale: Locale;
};

/**
 * Server-rendered home page deck of featured projects. All project images,
 * titles, project numbers and links ship in the initial HTML so crawlers
 * index the home page even without executing javascript.
 *
 * HomePageScrollDeck is a tiny client island that takes over after hydration:
 * it wires up the desktop wheel-scroll / arrow-keys deck navigation, opacity
 * dimming and animated scroll-to-active. Mobile/tablet uses native CSS
 * scroll-snap, no JavaScript needed.
 *
 * The welcome overlay (logo, once per session, desktop-only) is server-rendered
 * below and driven by an inline pre-paint script + CSS, so it paints on the
 * first frame instead of flashing in after hydration.
 */
export default function HomePageContent({ homepage, logoUrl, logoAltText, locale }: Props) {
  const projects = (homepage?.featuredProjects || []) as any[];

  if (projects.length === 0) return <div>No featured projects</div>;

  return (
    <section
      data-home-deck
      className="w-full h-[100svh] overflow-hidden lg:h-[90vh] relative"
    >
      {logoUrl && (
        // Welcome layer. Shown by default via CSS on desktop, so it paints with
        // the page (no flash of the site first). The <head> gate script hides it
        // for mobile/repeat views before first paint. Kept first in the DOM and
        // position:fixed so it always covers the deck below.
        <div
          className="welcome-overlay"
          aria-hidden="true"
          style={{ "--welcome-logo": `url("${logoUrl}")` } as CSSProperties}
        />
      )}
      <div className="w-full h-full flex flex-col overflow-hidden z-10">
        <div
          data-home-deck-scroller
          className="flex pt-0 w-full h-full snap-x snap-mandatory scroll-smooth overflow-x-auto lg:overflow-x-hidden lg:snap-none lg:scroll-auto"
        >
          {projects.map((project: any, index: number) => {
            const desktopImageUrl = project.featuredImage
              ? urlForImage(project.featuredImage)?.url()
              : null;
            const mobileImageUrl = project.mobileFeaturedImage
              ? urlForImage(project.mobileFeaturedImage)?.url()
              : null;
            const slug = project.slug?.current;
            if (!slug || (!desktopImageUrl && !mobileImageUrl)) return null;

            const featuredAltRaw = localizedText(project.featuredImage?.altText, locale);
            const mobileAltRaw = localizedText(project.mobileFeaturedImage?.altText, locale);
            const fallbackAlt = project.title || `Projecte destacat ${index + 1}`;
            const desktopAlt = featuredAltRaw || mobileAltRaw || fallbackAlt;
            const mobileAlt = mobileAltRaw || featuredAltRaw || fallbackAlt;

            return (
              <Link
                href={`/${locale}/projects/${slug}`}
                key={slug}
                data-home-deck-item
                data-slug={slug}
                className="flex-shrink-0 flex flex-col items-start snap-start w-screen md:w-auto h-[100svh] md:h-auto lg:snap-align-none lg:transition-opacity lg:duration-300"
                draggable={false}
              >
                <div className="w-screen md:w-auto flex-1 min-h-0 md:flex-none md:h-[85vh]">
                  {mobileImageUrl && (
                    <Image
                      src={mobileImageUrl}
                      alt={mobileAlt}
                      width={500}
                      height={800}
                      sizes="100vw"
                      className="object-cover h-full w-full md:hidden"
                      priority={index < 2}
                      draggable={false}
                    />
                  )}
                  {desktopImageUrl && (
                    <Image
                      src={desktopImageUrl}
                      alt={desktopAlt}
                      width={1000}
                      height={1500}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover h-full md:h-[85vh] w-full md:w-auto ${mobileImageUrl ? "hidden md:block" : "md:block"}`}
                      priority={index < 2}
                      draggable={false}
                    />
                  )}
                </div>
                <div className="mt-2 pb-3 md:pb-0 text-base monitor:text-xl pl-4 font-medium leading-tight flex shrink-0">
                  <div className="pr-3">{project.projectNumber}</div>
                  <div>{project.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <HomePageScrollDeck />
    </section>
  );
}
