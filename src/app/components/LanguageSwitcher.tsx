"use client";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  // 本地翻译函数，替代全局翻译
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
