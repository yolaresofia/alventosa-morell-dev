import Image from "next/image";
import { localizedText } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import { urlForImage } from "@/sanity/lib/utils";
import type { CoverImage as CoverImageType } from "@/sanity.types";

type CoverImageProps = {
  block: CoverImageType;
  locale: Locale;
};

export const CoverImage = ({ block, locale }: CoverImageProps) => {
  const alt = localizedText(block.altText, locale);
  const bottomText = localizedText(block.bottomText, locale);
  const desktopImageUrl = block.image ? urlForImage(block.image)?.width(1920).url() : undefined;
  const mobileImageUrl = block.mobileImage
    ? urlForImage(block.mobileImage)?.width(828).url()
    : undefined;
  const hasPadding = block.hasPadding || false;

  if (!desktopImageUrl && !mobileImageUrl) return null;

  const containerClass = hasPadding ? "w-full py-32" : "w-full h-screen";

  return (
    <div className={containerClass}>
      <div className="relative w-full h-screen">
        {mobileImageUrl && (
          <Image
            src={mobileImageUrl}
            alt={alt || ""}
            fill
            sizes="100vw"
            className="object-cover md:hidden"
            unoptimized
          />
        )}
        {desktopImageUrl && (
          <Image
            src={desktopImageUrl}
            alt={alt || ""}
            fill
            sizes="100vw"
            className={`object-cover ${mobileImageUrl ? "hidden md:block" : ""}`}
            unoptimized
          />
        )}
      </div>
      {bottomText && (
        <div className="pt-4 px-6">
          <p className="max-w-5xl md:text-base text-sm monitor:text-xl text-black font-medium leading-[1.5] mb-16">
            {bottomText}
          </p>
        </div>
      )}
    </div>
  );
};
