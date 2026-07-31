import type React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toPlainText } from "next-sanity";
import type { Metadata } from "next";
import { getSettings, getAboutPage } from "@/sanity/lib/fetchers";
import { getPathnameFromHeaders } from "@/app/i18n/server";
import { resolveOpenGraphImage, urlForImage } from "@/sanity/lib/utils";
import MobileNav from "@/app/components/MobileNav";
import Nav from "@/app/components/Nav";
import TopLogo from "@/app/components/TopLogo";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
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

  const [settings, about, pathname] = await Promise.all([
    getSettings(),
    getAboutPage(),
    getPathnameFromHeaders(),
  ]);

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
  const menuToggleLabel = localizedText(uiText?.navigation?.menuToggle, lang) || homeLabel;

  const addressText = about?.office?.address
    ? toPlainText(about.office.address).replace(/\s+/g, " ").trim()
    : null;
  const instagramUrl =
    about?.social?.instagram?.href || "https://www.instagram.com/alventosamorell/";
  const sameAs = [
    instagramUrl,
    "https://www.linkedin.com/company/alventosa-morell-arquitectes/",
  ];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitectureFirm",
    "@id": `${SITE_URL}/#organization`,
    name: "Alventosa Morell Arquitectes",
    url: SITE_URL,
    ...(logoUrl && { logo: logoUrl, image: logoUrl }),
    address: {
      "@type": "PostalAddress",
      // streetAddress keeps the full text from Sanity; the discrete fields below
      // let parsers extract city/postcode/region for local SEO and Maps matching.
      ...(addressText && { streetAddress: addressText }),
      postalCode: "08015",
      addressLocality: "Barcelona",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    ...(about?.contact?.phone && { telephone: about.contact.phone }),
    ...(about?.contact?.email && { email: about.contact.email }),
    sameAs,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Alventosa Morell Arquitectes",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["ca", "es", "en"],
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <nav className="sr-only" aria-label={homeLabel}>
        <Link href={`/${lang}`}>{homeLabel}</Link>
        {navLinks.map((link: any) => (
          <Link key={link.href} href={`/${lang}${link.href}`}>
            {localizedText(link.label, lang) || link.href}
          </Link>
        ))}
      </nav>
      {logoUrl && (
        <TopLogo
          logoUrl={logoUrl}
          logoAltText={logoAltText}
          locale={lang}
          pathname={pathname}
        />
      )}
      <MobileNav
        navLinks={navLinks}
        languages={languages}
        locale={lang}
        pathname={pathname}
        toggleLabel={menuToggleLabel}
      />
      {children}
      <Nav navLinks={navLinks} uiText={uiText} locale={lang} pathname={pathname} />
      <LanguageSwitcher
        languages={languages}
        currentLocale={lang}
        pathname={pathname}
      />
    </>
  );
}
