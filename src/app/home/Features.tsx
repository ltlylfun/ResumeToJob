"use client";
import { ReactNode } from "react";
import { FadeIn } from "components/animations/FadeIn";
import { StaggeredFadeIn } from "components/animations/StaggeredFadeIn";
import { useLanguage } from "../i18n/LanguageContext";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

// 定义特性列表的基本结构，后续会根据当前语言动态生成
const getFeatures = (language: string): Feature[] => {
  const features: Record<string, Feature> = {
    parser: {
      icon: <span className="text-3xl">🧠</span>,
      title: language === "en" ? "Resume Parsing" : "简历解析",
      description:
        language === "en"
          ? "We can parse your PDF resume, making it easier to create your resume"
          : "我们可以解析您的PDF简历，让你编写简历更加轻松",
    },
    templates: {
      icon: <span className="text-3xl">🎨</span>,
      title: language === "en" ? "Multiple Templates" : "多种精美模板",
      description:
        language === "en"
          ? "Offering various professionally designed templates for different industries and job requirements"
          : "提供多种专业设计的模板，满足不同行业和求职需求",
    },
    responsive: {
      icon: <span className="text-3xl">📱</span>,
      title: language === "en" ? "Responsive Design" : "响应式设计",
      description:
        language === "en"
          ? "Works smoothly on any device, from mobile to desktop"
          : "在任何设备上都能流畅工作，从手机到桌面电脑",
    },
    security: {
      icon: <span className="text-3xl">🔒</span>,
      title: language === "en" ? "Local Data Security" : "本地数据安全",
      description:
        language === "en"
          ? "Your resume data is stored entirely in your local browser and is not uploaded to servers"
          : "您的简历数据完全存储在本地浏览器中，不会上传到服务器",
    },
    export: {
      icon: <span className="text-3xl">🚀</span>,
      title: language === "en" ? "Quick Export" : "快速导出下载",
      description:
        language === "en"
          ? "Export high-quality PDF files with one click, ready to submit your application anytime"
          : "一键导出高质量PDF文件，随时准备投递申请",
    },
    ats: {
      icon: <span className="text-3xl">💯</span>,
      title: language === "en" ? "ATS-Friendly Format" : "ATS友好格式",
      description:
        language === "en"
          ? "Optimize resume structure to ensure Applicant Tracking Systems can correctly parse your information"
          : "优化简历结构，确保应聘者跟踪系统能正确解析您的信息",
    },
  };

  return Object.values(features);
};

export const Features = () => {
  const { language } = useLanguage();

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "All-in-one Resume Builder",
        zh: "全能简历生成工具",
      },
      subtitle: {
        en: "Packed with powerful features to help you create a professional resume and win interview opportunities",
        zh: "集众多强大功能于一体，助您打造专业简历，赢得面试机会",
      },
    };

    return translations[key]?.[language] || key;
  };
  return (
    <section className="mx-auto mt-12 max-w-6xl px-4 pb-12 sm:mt-16 sm:px-8 sm:pb-16">
      <FadeIn direction="up">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {translate("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-600 sm:mt-4 sm:text-lg">
          {translate("subtitle")}
        </p>
      </FadeIn>{" "}
      <StaggeredFadeIn
        as="div"
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-14 sm:gap-x-8 sm:gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        staggerDelay={100}
      >
        {getFeatures(language).map(({ icon, title, description }, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-100 sm:h-12 sm:w-12">
                {icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                {title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 sm:mt-3 sm:text-base">
              {description}
            </p>
          </div>
        ))}
      </StaggeredFadeIn>
    </section>
  );
};
