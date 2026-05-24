import type React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toPlainText } from "next-sanity";
import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/fetchers";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import { LanguageProvider } from "@/app/context/LanguageContext";
import MobileNav from "@/app/components/MobileNav";
import Nav from "@/app/components/Nav";
import TopLogo from "@/app/components/TopLogo";
import JsonLd from "@/app/components/JsonLd";
import { LOCALES, isLocale } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";
import { SITE_URL } from "@/app/config";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const settings = await getSettings();

  const title = settings?.siteTitle || "Alventosa Morell";
  const description = settings?.description
    ? toPlainText(settings.description)
    : undefined;
  const ogImage = resolveOpenGraphImage(settings?.ogImage);

  const seoDescription = description
    ? description.length > 155
      ? description.slice(0, 152) + "..."
      : description
    : undefined;

  const ogLocale =
    lang === "es" ? "es_ES" : lang === "en" ? "en_US" : "ca_ES";

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: seoDescription,
    openGraph: {
      title,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
      siteName: title,
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const settings = await getSettings();

  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.url() : null;
  const logoAltText = settings?.logo?.altText || null;
  const navLinks = (settings?.navLinks || [])
    .filter((link: any) => link.href && link.label)
    .map((link: any) => ({
      href: link.href,
      label: link.label,
    }));

  const languages = settings?.languages || ["ca", "es", "en"];
  const uiText = settings?.uiText ?? null;
  const homeLabel = localizedText(uiText?.navigation?.home, lang);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitectureFirm",
    name: "Alventosa Morell Arquitectes",
    url: SITE_URL,
    ...(logoUrl && { logo: logoUrl }),
    sameAs: [] as string[],
  };

  return (
    <LanguageProvider initialLanguage={lang}>
      <JsonLd data={organizationJsonLd} />
      <nav className="sr-only" aria-label={homeLabel}>
        <Link href={`/${lang}`}>{homeLabel}</Link>
        {navLinks.map((link: any) => (
          <Link key={link.href} href={`/${lang}${link.href}`}>
            {localizedText(link.label, lang) || link.href}
          </Link>
        ))}
      </nav>
      {logoUrl && <TopLogo logoUrl={logoUrl} logoAltText={logoAltText} />}
      <MobileNav navLinks={navLinks} languages={languages} />
      {children}
      <Nav navLinks={navLinks} uiText={uiText} />
    </LanguageProvider>
  );
}
