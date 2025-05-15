"use client";
import { useState } from "react";
import { FadeIn } from "components/animations/FadeIn";
import { StaggeredFadeIn } from "components/animations/StaggeredFadeIn";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

// 获取基于当前语言的FAQ项目
const getFAQItems = (language: string) => [
  {
    question:
      language === "en"
        ? "Is this resume builder completely free?"
        : "这个简历生成器完全免费吗？",
    answer:
      language === "en"
        ? "Yes, ResumeToJob is completely free to use. No registration required, no hidden fees, you can use all features freely."
        : "是的，ResumeToJob是完全免费的工具，无需注册账号，没有隐藏收费，您可以随意使用所有功能。",
  },
  {
    question:
      language === "en"
        ? "Where is my resume data stored?"
        : "我的简历数据会被保存在哪里？",
    answer:
      language === "en"
        ? "Your resume data is only saved in your browser's local storage and is not uploaded to any server. This means your data is private and secure, but it also means clearing browser data will result in information loss."
        : "您的简历数据仅保存在浏览器的本地存储中，不会上传到任何服务器。这意味着您的数据是私密安全的，但也意味着清除浏览器数据会导致信息丢失。",
  },
  {
    question: language === "en" ? "Origin of this project" : "该项目的由来",
    answer:
      language === "en"
        ? "This is a secondary development project based on open-resume. Open-resume is an excellent open-source project, but I discovered it lacked some needed features during use, such as personal photo display and theme switching. So I developed this project based on open-resume and shared it on GitHub."
        : "这是基于open-resume的二次开发项目。open-resume是一个非常优秀的开源项目，但我在使用过程中发现缺少一些需要的功能，如个人照片显示，主题切换等功能，所以我基于open-resume二次开发了这个项目，并分享在github上",
  },
  {
    question:
      language === "en"
        ? "Can I customize resume templates?"
        : "我可以自定义简历模板吗？",
    answer:
      language === "en"
        ? "Of course. Contributions of resume templates on GitHub are welcome."
        : "当然可以。欢迎github贡献简历模版。",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const { language } = useLanguageRedux();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // 获取当前语言的FAQ项目
  const faqItems = getFAQItems(language);

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Frequently Asked Questions",
        zh: "常见问题",
      },
      subtitle: {
        en: "Everything you want to know about ResumeToJob",
        zh: "关于ResumeToJob您想了解的一切",
      },
    };

    return translations[key]?.[language] || key;
  };
  return (
    <section className="mx-auto mt-12 max-w-3xl px-4 pb-16 sm:mt-16 sm:px-8 sm:pb-20">
      <FadeIn direction="up">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {translate("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-600 sm:mt-4 sm:text-lg">
          {translate("subtitle")}
        </p>
      </FadeIn>

      <StaggeredFadeIn
        as="div"
        className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white sm:mt-10"
        staggerDelay={50}
      >
        {faqItems.map((item, idx) => (
          <div key={idx} className="px-3 sm:px-4">
            <button
              className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-gray-900 focus:outline-none sm:py-5 sm:text-lg"
              onClick={() => toggleFAQ(idx)}
            >
              <span className="pr-4">{item.question}</span>
              <span className="ml-4 flex-shrink-0 sm:ml-6">
                {openIndex === idx ? (
                  <MinusIcon className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                ) : (
                  <PlusIcon className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-96 pb-4 sm:pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm text-gray-600 sm:text-base">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </StaggeredFadeIn>
    </section>
  );
};

// 简单的图标组件
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);
