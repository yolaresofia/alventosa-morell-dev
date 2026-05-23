import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/fetchers";
import { DEFAULT_LOCALE } from "@/app/i18n/config";
import { localizedText } from "@/app/i18n/text";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = localizedText(settings?.uiText?.notFound?.pageTitle, DEFAULT_LOCALE);
  return {
    ...(title && { title }),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const settings = await getSettings();
  const ui = settings?.uiText;
  const locale = DEFAULT_LOCALE;

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <p className="text-xl mb-8">{localizedText(ui?.notFound?.pageTitle, locale)}</p>
      <div className="flex gap-6 text-sm">
        <Link href={`/${locale}`} className="underline hover:text-red-500 transition-colors">
          {localizedText(ui?.navigation?.home, locale)}
        </Link>
        <Link href={`/${locale}/projects`} className="underline hover:text-red-500 transition-colors">
          {localizedText(ui?.navigation?.projects, locale)}
        </Link>
        <Link href={`/${locale}/about`} className="underline hover:text-red-500 transition-colors">
          {localizedText(ui?.navigation?.about, locale)}
        </Link>
      </div>
    </section>
  );
}
