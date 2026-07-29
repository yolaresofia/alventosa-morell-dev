import Link from "next/link";
import Image from "next/image";
import { localizedText, type LocalizedString } from "@/app/i18n/text";
import type { Locale } from "@/app/i18n/config";
import TopLogoVisibility from "./TopLogoVisibility";

type Props = {
  logoUrl: string;
  logoAltText?: LocalizedString | null;
  locale: Locale;
  /** Current request pathname (passed from the layout so this component stays sync). */
  pathname: string;
};

/**
 * Server component that renders the top logo with alt text in the initial HTML.
 * The homepage fade-in animation is delegated to the TopLogoVisibility client
 * island; on every other route the logo is visible immediately.
 */
export default function TopLogo({ logoUrl, logoAltText, locale, pathname }: Props) {
  const isHomepage = pathname === `/${locale}`;
  const logoAlt =
    localizedText(logoAltText || undefined, locale) || "Alventosa Morell Arquitectes";

  return (
    <TopLogoVisibility delayedReveal={isHomepage}>
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
    </TopLogoVisibility>
  );
}
