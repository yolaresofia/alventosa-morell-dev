import Image from "next/image";
import type { MonoptychImage as MonoptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { localizedText } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import MonoptychImageTrigger from "./MonoptychImageTrigger";

type Props = {
  block: MonoptychImageType & { _key?: string };
  locale: Locale;
};

/**
 * Server-rendered monoptych image. The image, alt text and layout ship in the
 * initial HTML for crawlers; only the popup-slider click handler runs on the
 * client (MonoptychImageTrigger overlays the image).
 */
export const MonoptychImage = ({ block, locale }: Props) => {
  const imageUrl = block.image ? urlForImage(block.image)?.url() : undefined;
  const altText = localizedText(block.altText, locale);

  if (!imageUrl) return null;

  return (
    <section className="w-full px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 py-32">
      <div className="max-w-5xl mx-auto relative">
        <div className="block md:hidden w-full">
          <Image
            src={imageUrl}
            alt={altText}
            width={1024}
            height={661}
            sizes="(max-width: 768px) 100vw, 1024px"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="hidden md:block relative" style={{ width: "1024px", height: "661px" }}>
          <Image src={imageUrl} alt={altText} fill className="object-cover" sizes="1024px" />
        </div>
        <MonoptychImageTrigger imageUrl={imageUrl} altText={altText} />
      </div>
    </section>
  );
};
