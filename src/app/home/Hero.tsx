"use client";
import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ResumeCarousel } from "home/ResumeCarousel";
import { FadeIn } from "components/animations/FadeIn";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export const Hero = () => {
  const { language } = useLanguageRedux();

  const translate = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Create a Professional Resume in Minutes",
        zh: "几分钟内创建专业简历",
      },
      subtitle: {
        en: "Free, open-source resume builder",
        zh: "免费、开源的简历生成器",
      },
      createButton: {
        en: "Create Resume",
        zh: "创建简历",
      },
      noRegistration: {
        en: "No registration required",
        zh: "无需注册",
      },
    };

    return translations[key]?.[language] || key;
  };
  return (
    <section className="relative overflow-hidden lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl px-4 pt-8 text-center lg:mx-0 lg:grow lg:px-0 lg:pt-32 lg:text-left">
        <FadeIn direction="up" duration={800}>
          <h1 className="text-primary pb-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {translate("title")}
          </h1>
        </FadeIn>

        <FadeIn direction="up" delay={200} duration={800}>
          <p className="mt-3 text-base sm:text-lg lg:mt-5 lg:text-xl">
            {translate("subtitle")}
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={400} duration={800}>
          <div className="flex flex-col justify-center sm:flex-row sm:items-center lg:justify-start">
            {" "}
            <Link
              href="/resume-builder"
              className="btn-primary mt-6 inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-lg lg:mt-14"
            >
              {translate("createButton")}{" "}
              <span
                aria-hidden="true"
                className="transition-all group-hover:ml-1"
              >
                →
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 sm:ml-6 sm:mt-6">
              {translate("noRegistration")}
            </p>
          </div>
        </FadeIn>

        {/* 已删除resume-parser相关内容 */}
      </div>{" "}
      <FlexboxSpacer maxWidth={50} minWidth={0} className="hidden lg:block" />
      {/* ResumeCarousel 组件只在大屏幕(lg及以上)显示 */}
      <div className="hidden lg:mx-0 lg:mt-0 lg:block lg:w-4/12 lg:max-w-xl lg:px-0 lg:pt-10">
        <ResumeCarousel />
      </div>
    </section>
  );
};
