"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { TextBlock as TextBlockType } from "@/sanity.types";

type Props = {
  block: TextBlockType;
};

export const TextBlock = ({ block }: Props) => {
  const { language } = useLanguage();
  const text = getTranslation(block?.text, language);
  const alignment = block.alignment || "left";

  return (
    <section className="w-full px-6 py-12">
      <div
        className={`max-w-4xl ${
          alignment === "right" ? "text-right ml-auto" : "text-left"
        }`}
      >
        <p className="text-base leading-[1.5] text-black">{text}</p>
      </div>
    </section>
  );
};
