"use client";
import { useState } from "react";
import { FadeIn } from "components/animations/FadeIn";
import { StaggeredFadeIn } from "components/animations/StaggeredFadeIn";

const FAQ_ITEMS = [
  {
    question: "这个简历生成器完全免费吗？",
    answer:
      "是的，ResumeToJob是完全免费的工具，无需注册账号，没有隐藏收费，您可以随意使用所有功能。",
  },
  {
    question: "我的简历数据会被保存在哪里？",
    answer:
      "您的简历数据仅保存在浏览器的本地存储中，不会上传到任何服务器。这意味着您的数据是私密安全的，但也意味着清除浏览器数据会导致信息丢失。",
  },
  {
    question: "能否导入我现有的简历？",
    answer:
      "可以。您可以上传PDF格式的简历，系统会自动解析内容并填充到编辑器中。解析效果最好的是单列布局的简历。",
  },
  {
    question: "该项目与open-resume有什么区别",
    answer:
      "open-resume是一个非常优秀的开源项目，但我在使用过程中发现缺少一些需要的功能，如个人照片显示，主题切换等功能，所以我基于open-resume二次开发了这个项目",
  },
  {
    question: "我可以自定义简历模板吗？",
    answer: "当然可以。欢迎github贡献简历模版。",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="mx-auto mt-16 max-w-3xl px-8 pb-20">
      <FadeIn direction="up">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          常见问题
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          关于ResumeToJob您想了解的一切
        </p>
      </FadeIn>

      <StaggeredFadeIn
        as="div"
        className="mt-10 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white"
        staggerDelay={50}
      >
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="px-4">
            <button
              className="flex w-full items-center justify-between py-5 text-left text-lg font-medium text-gray-900 focus:outline-none"
              onClick={() => toggleFAQ(idx)}
            >
              <span>{item.question}</span>
              <span className="ml-6 flex-shrink-0">
                {openIndex === idx ? (
                  <MinusIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <PlusIcon className="h-5 w-5 text-gray-500" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.answer}</p>
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
