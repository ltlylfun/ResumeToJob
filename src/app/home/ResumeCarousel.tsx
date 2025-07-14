"use client";
import { useState, useEffect, useCallback } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { getResumeByLang } from "home/constants";
import { getAllTemplates } from "components/Resume/ResumePDF/templates";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const ResumeCarousel = () => {
  const { language } = useLanguageRedux();
  const resume = getResumeByLang(language);

  const templates = getAllTemplates();
  const [templateIndex, setTemplateIndex] = useState(0);
  const [settings, setSettings] = useState({
    ...initialSettings,
    template: templates[0]?.id || "elegant",
    themeColor: "#0ea5e9",
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextTemplate = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      const nextIndex = (templateIndex + 1) % templates.length;
      setTemplateIndex(nextIndex);
      setSettings((prevSettings) => ({
        ...prevSettings,
        template: templates[nextIndex]?.id || "elegant",
      }));

      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 350);
  }, [templateIndex, templates, isTransitioning]);

  const prevTemplate = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      const prevIndex =
        (templateIndex - 1 + templates.length) % templates.length;
      setTemplateIndex(prevIndex);
      setSettings((prevSettings) => ({
        ...prevSettings,
        template: templates[prevIndex]?.id || "elegant",
      }));

      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 350);
  }, [templateIndex, templates, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTemplate();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextTemplate]);

  // 直接选择模板
  const handleTemplateChange = useCallback(
    (templateId: string) => {
      // 防止在过渡中再次触发
      if (isTransitioning) return;

      const index = templates.findIndex(
        (template) => template.id === templateId,
      );

      // 如果点击当前模板，不执行切换
      if (index === templateIndex) return;

      if (index !== -1) {
        setIsTransitioning(true);

        // 使用相同的两阶段过渡动画
        setTimeout(() => {
          setTemplateIndex(index);
          setSettings((prevSettings) => ({
            ...prevSettings,
            template: templateId,
          }));

          setTimeout(() => {
            setIsTransitioning(false);
          }, 350);
        }, 350);
      }
    },
    [templates, templateIndex, isTransitioning],
  );

  // 设置缩放比例 - 因为组件只在桌面端显示，所以直接返回桌面比例
  const getScaleForScreen = () => {
    return 0.6; // 桌面端缩放比例
  };

  return (
    <div className="relative -mt-2">
      <div className="relative mx-auto max-w-full">
        {/* 简历展示 */}
        <div
          className={`transform transition-all duration-700 ease-in-out ${
            isTransitioning
              ? "scale-[0.98] opacity-80"
              : "scale-100 opacity-100"
          }`}
        >
          <ResumeIframeCSR
            documentSize="A4"
            scale={getScaleForScreen()}
            enablePDFViewer={false}
            showToolbar={false}
          >
            <ResumePDF resume={resume} settings={settings} isPDF={false} />
          </ResumeIframeCSR>
        </div>

        {/* 轮播指示器和控制按钮 */}
        <div className="relative mt-4 flex w-full items-center justify-center">
          {/* 左箭头按钮 */}
          <button
            onClick={prevTemplate}
            disabled={isTransitioning}
            className="mr-4 rounded-full bg-white bg-opacity-70 p-1.5 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-90 hover:shadow-xl"
            aria-label="上一个模板"
          >
            <ChevronLeftIcon className="h-4 w-4 text-sky-600" />
          </button>

          {/* 指示器 */}
          <div className="flex justify-center gap-2">
            {templates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className={`h-2.5 transition-all duration-500 ease-out ${
                  index === templateIndex
                    ? "w-6 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-md shadow-sky-200"
                    : "w-2.5 rounded-full bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`切换到模板 ${template.name}`}
              />
            ))}
          </div>

          {/* 右箭头按钮 */}
          <button
            onClick={nextTemplate}
            disabled={isTransitioning}
            className="ml-4 rounded-full bg-white bg-opacity-70 p-1.5 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-opacity-90 hover:shadow-xl"
            aria-label="下一个模板"
          >
            <ChevronRightIcon className="h-4 w-4 text-sky-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
