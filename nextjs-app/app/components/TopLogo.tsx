"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation, LocalizedField } from "@/app/utils/translations";

type Props = {
  logoUrl: string;
  logoAltText?: LocalizedField | null;
};

export default function TopLogo({ logoUrl, logoAltText }: Props) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const [visible, setVisible] = useState(!isHomepage);
  const { language } = useLanguage();
  const logoAlt = getTranslation(logoAltText || undefined, language) || "Alventosa Morell Arquitectes";

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
        href="/"
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
