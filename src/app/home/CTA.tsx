import Link from "next/link";
import { FadeIn } from "components/animations/FadeIn";

export const CTA = () => {
  return (
    <FadeIn direction="up">
      <section className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-[color:var(--theme-purple)] to-[color:var(--theme-blue)]">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-white"></div>
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white"></div>
        </div>

        <div className="relative px-8 py-20 text-center text-white md:py-24">
          <h2 className="text-3xl font-bold md:text-4xl">
            准备好打造您的简历了吗？
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg opacity-90">
            轻松创建、编辑和下载精美的专业简历，提高您的求职成功率
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/resume-import"
              className="inline-block rounded-full bg-white px-8 py-3 text-lg font-medium text-sky-700 transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-lg"
            >
              立即开始
            </Link>
            <Link
              href="/resume-parser"
              className="inline-block rounded-full border-2 border-white px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
            >
              测试ATS解析
            </Link>
          </div>
        </div>
      </section>
    </FadeIn>
  );
};
