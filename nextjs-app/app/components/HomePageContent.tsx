import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { localizedText, type LocalizedString } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import HomePageScrollDeck from "./HomePageScrollDeck";
import HomePageWelcomeAnimation from "./HomePageWelcomeAnimation";

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
 * Two tiny client islands take over after hydration:
 *   - HomePageScrollDeck: wires up the desktop wheel-scroll / arrow-keys deck navigation, opacity dimming and animated scroll-to-active.
 *   - HomePageWelcomeAnimation: handles the one-time welcome overlay with the logo (per session, desktop-only).
 *
 * Mobile/tablet uses native CSS scroll-snap, no JavaScript needed.
 */
export default function HomePageContent({ homepage, logoUrl, logoAltText, locale }: Props) {
  const projects = (homepage?.featuredProjects || []) as any[];

  if (projects.length === 0) return <div>No featured projects</div>;

  const logoAlt = localizedText(logoAltText || undefined, locale) || "Alventosa Morell Arquitectes";

  return (
    <section
      data-home-deck
      className="w-full h-auto lg:h-[90vh] lg:overflow-hidden relative"
    >
      <div className="w-full h-full flex flex-col overflow-hidden z-10">
        <div
          data-home-deck-scroller
          className="flex pt-0 w-full h-full snap-x snap-mandatory scroll-smooth overflow-x-auto lg:overflow-x-hidden lg:snap-none"
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
                className="flex-shrink-0 flex flex-col items-start snap-start lg:snap-align-none lg:transition-opacity lg:duration-300"
                draggable={false}
              >
                <div className="h-[85vh] w-screen md:w-auto">
                  {mobileImageUrl && (
                    <Image
                      src={mobileImageUrl}
                      alt={mobileAlt}
                      width={500}
                      height={800}
                      sizes="100vw"
                      className="object-cover h-[85vh] w-screen md:hidden"
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
                      className={`object-cover h-[85vh] w-auto ${mobileImageUrl ? "hidden md:block" : "md:block"}`}
                      priority={index < 2}
                      draggable={false}
                    />
                  )}
                </div>
                <div className="mt-2 text-base monitor:text-xl pl-4 font-medium leading-tight flex">
                  <div className="pr-3">{project.projectNumber}</div>
                  <div>{project.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <HomePageScrollDeck />
      {logoUrl && <HomePageWelcomeAnimation logoUrl={logoUrl} logoAlt={logoAlt} />}
    </section>
  );
}
