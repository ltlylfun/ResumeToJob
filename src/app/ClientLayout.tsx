"use client";
import { useEffect } from "react";
import { useLanguage } from "./i18n/LanguageContext";
import { DynamicMetadata } from "./components/DynamicMetadata";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  // 动态更新 HTML lang 属性
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return (
    <>
      <DynamicMetadata />
      {children}
    </>
  );
}
