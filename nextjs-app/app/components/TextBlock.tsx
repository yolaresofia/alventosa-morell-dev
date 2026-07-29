import { localizedText } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import { TextBlock as TextBlockType } from "@/sanity.types";

type Props = {
  block: TextBlockType;
  locale: Locale;
};

export const TextBlock = ({ block, locale }: Props) => {
  const text = localizedText(block?.text, locale);
  const alignment = block.alignment || "left";
  const hasPaddingBottom = block.hasPaddingBottom;

  return (
    <section className={`w-full px-6 pt-12 ${hasPaddingBottom ? "pb-48" : "pb-0"}`}>
      <div
        className={`max-w-4xl ${alignment === "right" ? "text-right ml-auto" : "text-left"}`}
      >
        <p className="md:text-base text-sm monitor:text-xl leading-[1.5] text-black">{text}</p>
      </div>
    </section>
  );
};
