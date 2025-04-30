"use client";

import { TextBlock as TextBlockType } from "@/sanity.types";
import { getTranslation } from "@/app/utils/translations";

type Props = {
  block: TextBlockType;
};

export const TextBlock = ({ block }: Props) => {
  const language: "ca" | "es" | "en" = "ca";
  const text = getTranslation(block?.text, language);
  const alignment = block.alignment || "left";

  return (
    <section className="w-full px-8 py-12">
      <div
        className={`max-w-4xl ${
          alignment === "right" ? "text-right ml-auto" : "text-left"
        }`}
      >
        <p className="text-base leading-tight text-black">{text}</p>
      </div>
    </section>
  );
};
