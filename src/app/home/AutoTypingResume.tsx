"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, getResumeByLang } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { getAllTemplates } from "components/Resume/ResumePDF/templates";
import { TemplateSelector } from "home/TemplateSelector";
import { deepClone } from "lib/deep-clone";
import { useLanguage } from "../i18n/LanguageContext";
import React from "react";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 16.6; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 28;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s

export const AutoTypingResume = () => {
  const { language } = useLanguage();

  // 根据当前语言获取对应的示例简历
  const endResume = getResumeByLang(language);

  // 预先为起始状态添加照片，确保一开始就显示图片
  const modifiedStartResume = React.useMemo(
    () => ({
      ...START_HOME_RESUME,
      profile: {
        ...START_HOME_RESUME.profile,
        photoUrl: endResume.profile.photoUrl,
      },
    }),
    [endResume.profile.photoUrl]
  );

  const [resume, setResume] = useState(modifiedStartResume);
  const [settings, setSettings] = useState({
    ...initialSettings,
    template: "elegant",
    themeColor: "#0ea5e9",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { md } = useTailwindBreakpoints();

  // 添加模板状态管理
  const templates = getAllTemplates();

  // 切换模板
  const handleTemplateChange = (templateId: string) => {
    setSettings({
      ...settings,
      template: templateId,
    });
  };

  // 预加载简历中的图片
  useEffect(() => {
    const photoUrl = endResume.profile.photoUrl;

    if (photoUrl) {
      const img = new window.Image();
      img.onload = () => {
        setImagesPreloaded(true);
      };
      img.onerror = () => {
        setImagesPreloaded(true);
      };
      img.src = photoUrl;
    } else {
      setImagesPreloaded(true);
    }
  }, [endResume.profile.photoUrl]);

  // 确保在组件卸载时清除interval
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 创建一个自定义的简历更新函数，确保图片在动画过程中不会被修改
  const createResumeWithPreservedImage = useCallback(
    (currentResume: any, updatedResume: any) => {
      // 深度克隆更新后的简历
      const result = deepClone(updatedResume);

      // 确保图片URL保持不变（使用当前语言的最终图片）
      if (endResume.profile?.photoUrl && result.profile) {
        result.profile.photoUrl = endResume.profile.photoUrl;
      }

      return result;
    },
    [endResume.profile.photoUrl]
  );

  // 当语言改变时更新简历
  useEffect(() => {
    if (isComplete) {
      const currentEndResume = getResumeByLang(language);
      setResume(currentEndResume);
    }
  }, [language, isComplete]);

  // 重启打字效果
  const restartTypingEffect = useCallback(() => {
    // 清除现有interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 重置完成状态
    setIsComplete(false);

    // 获取当前语言的简历
    const currentEndResume = getResumeByLang(language);

    // 设置初始状态
    setResume(modifiedStartResume);

    // 创建迭代器
    const resumeCharIterator = makeObjectCharIterator(
      modifiedStartResume,
      currentEndResume,
      CHARS_PER_INTERVAL
    );

    let iter = resumeCharIterator.next();
    if (!iter.done) {
      const updatedResume = createResumeWithPreservedImage(
        modifiedStartResume,
        iter.value
      );
      setResume(updatedResume);
    }

    // 设置interval
    intervalRef.current = setInterval(() => {
      iter = resumeCharIterator.next();
      if (iter.done) {
        setIsComplete(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        const updatedResume = createResumeWithPreservedImage(
          modifiedStartResume,
          iter.value
        );
        setResume(updatedResume);
      }
    }, INTERVAL_MS);
  }, [modifiedStartResume, language, createResumeWithPreservedImage]);

  // 当语言变化时重启打字效果
  useEffect(() => {
    if (md && imagesPreloaded) {
      restartTypingEffect();
    } else if (!md) {
      // 在移动端直接显示完整简历
      const currentEndResume = getResumeByLang(language);
      setResume(currentEndResume);
      setIsComplete(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [md, imagesPreloaded, language, restartTypingEffect]);
  // 根据屏幕尺寸获取适合的缩放比例
  const getScaleForScreen = () => {
    if (!md) {
      // 移动设备使用更小的缩放比例
      return 0.35; // 移动端缩放比例
    }
    return 0.6; // 桌面端缩放比例
  };

  return (
    <div className="relative mt-4 sm:mt-6 md:mt-10">
      <div className="absolute -top-10 left-0 right-0 flex justify-center sm:-top-12">
        <TemplateSelector
          templates={templates}
          currentTemplate={settings.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      <div className="mx-auto max-w-full">
        <ResumeIframeCSR
          documentSize="A4"
          scale={getScaleForScreen()}
          enablePDFViewer={false}
          showToolbar={false}
        >
          <ResumePDF resume={resume} settings={settings} isPDF={false} />
        </ResumeIframeCSR>
      </div>
    </div>
  );
};
