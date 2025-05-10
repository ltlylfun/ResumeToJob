"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLanguage } from "./translations";
import { getBrowserLanguage, setLocalStorageItem, isBrowser } from "./utils";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const defaultLanguage: SupportedLanguage = "zh";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(defaultLanguage);

  // 在组件挂载时，从本地存储加载语言设置
  useEffect(() => {
    if (isBrowser) {
      const browserLang = getBrowserLanguage();
      setLanguageState(browserLang);
    }
  }, []);

  // 设置语言并保存到本地存储
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setLocalStorageItem("language", lang);
    if (isBrowser) {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
