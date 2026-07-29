import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { localizedText } from "@/app/i18n/text";
import type { ImageCarousel as ImageCarouselType } from "@/sanity.types";
import type { Locale } from "@/app/i18n/config";
import ImageCarouselInteractive from "./ImageCarouselInteractive";

type Props = {
  block: ImageCarouselType & { _key?: string };
  locale: Locale;
};

/**
 * Server-rendered image carousel. The first image is visible immediately;
 * the rest are pre-rendered too (with all alt texts) so crawlers index every
 * image but only the first one is laid out by default. The interactive
 * client island upgrades this into a real carousel (prev/next nav + popup
 * slider on click).
 */
export const ImageCarousel = ({ block, locale }: Props) => {
  const images = block.images ?? [];
  if (images.length < 2) return null;

  const sliderImages = images
    .map((img) => {
      if (!img.image?.asset) return null;
      const url = urlForImage(img.image)?.width(2400).quality(100).auto("format").url();
      if (!url) return null;
      return { url, alt: localizedText(img.altText, locale) };
    })
    .filter(Boolean) as { url: string; alt: string }[];

  const displayImages = images
    .map((img) => {
      if (!img.image?.asset) return null;
      const url = urlForImage(img.image)?.width(1600).quality(85).auto("format").url();
      if (!url) return null;
      return { url, alt: localizedText(img.altText, locale) };
    })
    .filter(Boolean) as { url: string; alt: string }[];

  if (sliderImages.length === 0) return null;

  const componentId = `carousel-${block._key}`;

  return (
    <section className="w-full bg-white pt-24 pb-24 relative overflow-hidden">
      <div
        className="max-w-6xl mx-auto flex justify-center items-center relative"
        data-carousel
        data-carousel-id={componentId}
      >
        <div className="w-full px-16 sm:px-20 md:px-24 lg:px-32">
          <div className="relative w-full max-w-sm sm:max-w-2xl md:max-w-4xl aspect-[3/2] mx-auto">
            {displayImages.map((img, idx) => (
              <Image
                key={img.url}
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) calc(100vw - 128px), (max-width: 768px) calc(100vw - 160px), (max-width: 1024px) calc(100vw - 192px), calc(100vw - 256px)"
                className={`object-contain ${idx === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                data-carousel-image
                data-carousel-index={idx}
                priority={idx === 0}
              />
            ))}
          </div>
        </div>

        <ImageCarouselInteractive
          imagesCount={displayImages.length}
          sliderImages={sliderImages}
          componentId={componentId}
        />
      </div>
    </section>
  );
};
