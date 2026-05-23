import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/fetchers";
import { getLocaleFromHeaders } from "@/app/i18n/server";
import { localizedText } from "@/app/i18n/text";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromHeaders();
  const settings = await getSettings();
  const ui = settings?.uiText?.notFound;
  const title = localizedText(ui?.projectTitle, locale);
  const description = localizedText(ui?.projectDescription, locale);
  return {
    ...(title && { title }),
    ...(description && { description }),
    robots: { index: false, follow: false },
  };
}

export default async function ProjectNotFound() {
  const locale = await getLocaleFromHeaders();
  const settings = await getSettings();
  const ui = settings?.uiText;

  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <p className="text-xl mb-8">{localizedText(ui?.notFound?.projectTitle, locale)}</p>
      <div className="flex gap-6 text-sm">
        <Link href={`/${locale}/projects`} className="underline hover:text-red-500 transition-colors">
          {localizedText(ui?.navigation?.allProjects, locale)}
        </Link>
        <Link href={`/${locale}`} className="underline hover:text-red-500 transition-colors">
          {localizedText(ui?.navigation?.home, locale)}
        </Link>
      </div>
    </section>
  );
}
