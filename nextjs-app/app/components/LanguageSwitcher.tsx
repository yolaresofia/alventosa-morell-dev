"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export default function LanguageSwitcher({ languages }: { languages: string[] }) {
  const { language, setLanguage } = useLanguage();

  const availableLanguages = languages.filter((lang) => lang !== language);

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2 text-sm z-40">
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          className="hover:underline uppercase"
          onClick={() => setLanguage(lang as "ca" | "es" | "en")}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
