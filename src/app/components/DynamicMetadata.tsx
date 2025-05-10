"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../i18n/LanguageContext";

export const DynamicMetadata = () => {
  const { language } = useLanguage();
  const pathname = usePathname();

  // 本地翻译函数，替代全局翻译
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "ResumeToJob - Free Open-Source Resume Builder and Parser",
        zh: "ResumeToJob - 免费开源简历生成器和解析器",
      },
      description: {
        en: "ResumeToJob is a free, open-source and powerful resume builder that allows anyone to create a modern and professional resume in 3 simple steps.",
        zh: "ResumeToJob是一个免费、开源且功能强大的简历生成器，允许任何人通过3个简单步骤创建现代专业简历。",
      },
    };

    return translations[key]?.[language] || key;
  };

  useEffect(() => {
    // 动态更新元数据
    if (pathname === "/") {
      document.title = translate("title");
      // 查找或创建描述元标签
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", translate("description"));
    }
  }, [language, pathname]);

  return null;
};
