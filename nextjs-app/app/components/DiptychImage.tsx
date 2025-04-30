"use client";

import Image from "next/image";
import { DiptychImage as DiptychImageType } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { getTranslation } from "@/app/utils/translations";

type Props = {
  block: DiptychImageType;
};

export const DiptychImage = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca";

  const leftImageUrl = block.leftImage
    ? urlForImage(block.leftImage)?.url()
    : "";
  const rightImageUrl = block.rightImage
    ? urlForImage(block.rightImage)?.url()
    : "";

  const leftAlt = getTranslation(block.leftAltText, language);
  const rightAlt = getTranslation(block.rightAltText, language);

  const pt = block.paddingTop ? `pt-${block.paddingTop}` : "";
  const pb = block.paddingBottom ? `pb-${block.paddingBottom}` : "";

  if (!leftImageUrl || !rightImageUrl) return null;

  console.log(pt, pb)

  return (
    <section className={`w-full px-4 sm:px-8 md:px-16 lg:px-48 ${pt ? pt : 'pt-48'} ${pb ? pb : 'pb-48'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={leftImageUrl}
            alt={leftAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={rightImageUrl}
            alt={rightAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};
