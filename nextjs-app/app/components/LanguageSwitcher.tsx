"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export default function LanguageSwitcher({
  languages,
  mobile = false,
}: {
  languages: string[];
  mobile?: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const availableLanguages = languages.filter((lang) => lang !== language);

  return (
    <div
      className={`${
        mobile
          ? "absolute bottom-10 left-1/2 transform -translate-x-1/2 text-4xl"
          : "fixed bottom-4 right-4 text-sm z-40 hidden md:flex"
      } flex items-center space-x-2`}
    >
      {availableLanguages.map((lang, idx) => (
        <div key={lang} className="flex items-center space-x-1">
          <button
            className="uppercase"
            onClick={() => setLanguage(lang as "ca" | "es" | "en")}
          >
            {lang}
          </button>
          {idx < availableLanguages.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
}
