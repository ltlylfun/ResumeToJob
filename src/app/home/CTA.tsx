"use client";
import Link from "next/link";
import { FadeIn } from "components/animations/FadeIn";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export const CTA = () => {
  const { language } = useLanguageRedux();

  // 翻译函数，处理所有文本内容
  const translate = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Ready to Create Your Resume?",
        zh: "准备好创建您的简历了吗？",
      },
      subtitle: {
        en: "Easily create, edit and download beautiful professional resumes to improve your job application success rate",
        zh: "轻松创建、编辑和下载精美的专业简历，提高您的求职成功率",
      },
      button: {
        en: "Get Started",
        zh: "立即开始",
      },
    };

    return translations[key]?.[language] || key;
  };
  return (
    <FadeIn direction="up">
      <section className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-xl bg-gradient-to-r from-[color:var(--theme-purple)] to-[color:var(--theme-blue)] sm:mt-12 sm:rounded-2xl">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-white"></div>
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white"></div>
        </div>

        <div className="relative px-4 py-12 text-center text-white sm:px-8 sm:py-20 md:py-24">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            {translate("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base opacity-90 sm:mt-6 sm:text-lg">
            {translate("subtitle")}
          </p>
          <div className="mt-8 flex justify-center sm:mt-10">
            {" "}
            <Link
              href="/resume-builder"
              className="inline-block rounded-full bg-white px-6 py-2.5 text-base font-medium text-sky-700 transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-lg sm:px-8 sm:py-3 sm:text-lg"
            >
              {translate("button")}
            </Link>
          </div>
        </div>
      </section>
    </FadeIn>
  );
};
