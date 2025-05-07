import { ReactNode } from "react";
import { FadeIn } from "components/animations/FadeIn";
import { StaggeredFadeIn } from "components/animations/StaggeredFadeIn";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <span className="text-3xl">🧠</span>,
    title: "简历解析",
    description: "我们可以解析您的PDF简历，让你编写简历更加轻松",
  },
  {
    icon: <span className="text-3xl">🎨</span>,
    title: "多种精美模板",
    description: "提供多种专业设计的模板，满足不同行业和求职需求",
  },
  {
    icon: <span className="text-3xl">📱</span>,
    title: "响应式设计",
    description: "在任何设备上都能流畅工作，从手机到桌面电脑",
  },
  {
    icon: <span className="text-3xl">🔒</span>,
    title: "本地数据安全",
    description: "您的简历数据完全存储在本地浏览器中，不会上传到服务器",
  },
  {
    icon: <span className="text-3xl">🚀</span>,
    title: "快速导出下载",
    description: "一键导出高质量PDF文件，随时准备投递申请",
  },
  {
    icon: <span className="text-3xl">💯</span>,
    title: "ATS友好格式",
    description: "优化简历结构，确保应聘者跟踪系统能正确解析您的信息",
  },
];

export const Features = () => {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-8 pb-16">
      <FadeIn direction="up">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          全能简历生成工具
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          集众多强大功能于一体，助您打造专业简历，赢得面试机会
        </p>
      </FadeIn>

      <StaggeredFadeIn
        as="div"
        className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        staggerDelay={100}
      >
        {FEATURES.map(({ icon, title, description }, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-100">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="mt-3 text-gray-600">{description}</p>
          </div>
        ))}
      </StaggeredFadeIn>
    </section>
  );
};
