"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "ca" | "es" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language | null>(null);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as Language | null;
    if (storedLang && ["ca", "es", "en"].includes(storedLang)) {
      setLanguage(storedLang);
    } else {
      setLanguage("ca");
    }
  }, []);

  useEffect(() => {
    if (language) {
      localStorage.setItem("lang", language);
    }
  }, [language]);
  if (!language) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
