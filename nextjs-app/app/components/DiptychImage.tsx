import Image from "next/image";
import type { DiptychImage as DiptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { localizedText } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import DiptychImageTrigger from "./DiptychImageTrigger";

type Props = {
  block: DiptychImageType & { _key?: string };
  locale: Locale;
};

/**
 * Server-rendered diptych image. Both images, alt text and (optional) hover
 * variants ship in the initial HTML. Hover swap is pure CSS (Tailwind
 * group-hover). Each side's popup-slider trigger is a tiny client island.
 */
export const DiptychImage = ({ block, locale }: Props) => {
  const leftImageUrl = block.leftImage ? urlForImage(block.leftImage)?.url() : undefined;
  const leftHoverUrl = block.leftImageOnHover
    ? urlForImage(block.leftImageOnHover)?.url()
    : undefined;

  const rightImageUrl = block.rightImage ? urlForImage(block.rightImage)?.url() : undefined;
  const rightHoverUrl = block.rightImageOnHover
    ? urlForImage(block.rightImageOnHover)?.url()
    : undefined;

  const leftAlt = localizedText(block.leftAltText, locale);
  const rightAlt = localizedText(block.rightAltText, locale);
  const leftAltHover = localizedText(block.leftHoverAltText, locale);
  const rightAltHover = localizedText(block.rightHoverAltText, locale);
  const leftAltDefault = leftAlt || leftAltHover || "Imatge esquerra";
  const rightAltDefault = rightAlt || rightAltHover || "Imatge dreta";
  const leftHoverAltDefault = leftAltHover || leftAltDefault;
  const rightHoverAltDefault = rightAltHover || rightAltDefault;

  if (!leftImageUrl || !rightImageUrl) return null;

  const sliderImages = [
    { url: leftImageUrl, alt: leftAltDefault },
    ...(leftHoverUrl ? [{ url: leftHoverUrl, alt: `${leftHoverAltDefault} (hover)` }] : []),
    { url: rightImageUrl, alt: rightAltDefault },
    ...(rightHoverUrl ? [{ url: rightHoverUrl, alt: `${rightHoverAltDefault} (hover)` }] : []),
  ];

  return (
    <section className="w-full px-6 sm:px-16 md:px-24 lg:px-32 xl:px-48 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="relative w-full aspect-[3/4] group">
            <Image
              src={leftImageUrl}
              alt={leftAltDefault}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                leftHoverUrl ? "md:group-hover:opacity-0" : ""
              }`}
            />
            {leftHoverUrl && (
              <Image
                src={leftHoverUrl}
                alt={leftHoverAltDefault}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 ease-in-out hidden md:block md:group-hover:opacity-100"
              />
            )}
            <DiptychImageTrigger
              imageUrl={leftImageUrl}
              altText={leftAltDefault}
              sliderImages={sliderImages}
              componentId={`diptych-${block._key}-left`}
            />
          </div>
          <div className="relative w-full aspect-[3/4] group">
            <Image
              src={rightImageUrl}
              alt={rightAltDefault}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-300 ease-in-out ${
                rightHoverUrl ? "md:group-hover:opacity-0" : ""
              }`}
            />
            {rightHoverUrl && (
              <Image
                src={rightHoverUrl}
                alt={rightHoverAltDefault}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-in-out hidden md:block md:group-hover:opacity-100"
              />
            )}
            <DiptychImageTrigger
              imageUrl={rightImageUrl}
              altText={rightAltDefault}
              sliderImages={sliderImages}
              componentId={`diptych-${block._key}-right`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
