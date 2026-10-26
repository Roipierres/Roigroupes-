import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('roigroupes_lang');
    return (saved === 'ar' || saved === 'en' || saved === 'fr') ? saved : 'ar';
  });

  const isRtl = lang === 'ar';

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('roigroupes_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
