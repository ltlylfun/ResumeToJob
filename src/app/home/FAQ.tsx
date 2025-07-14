"use client";
import { useState } from "react";
import { FadeIn } from "components/animations/FadeIn";
import { StaggeredFadeIn } from "components/animations/StaggeredFadeIn";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

const getFAQItems = (language: string) => [
  {
    question:
      language === "en"
        ? "Why is my exported resume showing garbled characters?"
        : "为什么我的简历导出后是乱码？",
    answer:
      language === "en"
        ? "This is usually because you haven't selected the correct font or the fonts haven't loaded properly due to slow network speeds. Please ensure the fonts have loaded completely before exporting your resume."
        : "没有选择正确的字体或者因为网速慢字体未加载好。请确保字体完全加载后再导出简历。",
  },
  {
    question:
      language === "en"
        ? "Why don't I see Chinese fonts in the font options?"
        : "为什么我的字体选项里没有中文字体？",
    answer:
      language === "en"
        ? "Because Chinese fonts are large, ResumeToJob checks your browser language settings. If your browser language does not include Chinese, Chinese fonts will not be loaded."
        : "由于中文字体较大，ResumeToJob会查看你的浏览器语言设置，如果你的浏览器语言没有包括中文，那么就不会加载中文字体。",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const { language } = useLanguageRedux();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqItems = getFAQItems(language);

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Frequently Asked Questions",
        zh: "常见问题",
      },
      subtitle: {
        en: "Frequently encountered issues about ResumeToJob on GitHub",
        zh: "关于ResumeToJob的Github常见Issues",
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
