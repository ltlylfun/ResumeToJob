"use client";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";
import { SupportedLanguage } from "../lib/redux/types";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageRedux();

  const translate = () => {
    return language === "en" ? "中文" : "English";
  };

  const toggleLanguage = () => {
    const newLanguage: SupportedLanguage = language === "zh" ? "en" : "zh";
    setLanguage(newLanguage);
  };
  return (
    <button
      onClick={toggleLanguage}
      className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 md:px-3"
      aria-label="Change language"
    >
      {translate()}
    </button>
  );
};
