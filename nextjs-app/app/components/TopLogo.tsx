"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "@/app/i18n/client";
import { localizedText, type LocalizedString } from "@/app/i18n/text";

type Props = {
  logoUrl: string;
  logoAltText?: LocalizedString | null;
};

export default function TopLogo({ logoUrl, logoAltText }: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const isHomepage = pathname === `/${locale}`;

  const [visible, setVisible] = useState(!isHomepage);
  const logoAlt = localizedText(logoAltText || undefined, locale) || "Alventosa Morell Arquitectes";

  useEffect(() => {
    if (!isHomepage) {
      setVisible(true);
      return;
    }
    setVisible(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 1100);

    return () => clearTimeout(timer);
  }, [isHomepage]);

  return (
    <div
      className={`fixed top-0 w-full h-[60px] z-30 flex justify-center items-center px-4 transition-opacity duration-300 ease-in ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Link
        href={`/${locale}`}
        className="relative block w-[200px] h-[44px] md:w-[250px] md:h-[55px] monitor:w-[300px] monitor:h-[66px]"
      >
        <Image
          src={logoUrl}
          alt={logoAlt}
          className="object-contain"
          priority
          fill
        />
      </Link>
    </div>
  );
}
