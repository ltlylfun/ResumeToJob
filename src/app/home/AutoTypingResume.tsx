"use client";
import { useEffect, useState, useRef, useCallback, memo } from "react";
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
import Image from "next/image";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 16.6; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 28;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s

// 创建一个稳定的照片组件，使其完全独立于简历渲染
const StableProfilePhoto = memo(
  ({ photoUrl, scale }: { photoUrl: string; scale: number }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (photoUrl) {
        const img = new window.Image();
        img.onload = () => setLoaded(true);
        img.src = photoUrl;
      }
    }, [photoUrl]);

    // 计算照片在A4页面上的相对位置
    // A4纸张尺寸：210×297mm
    // 根据简历模板中照片的位置，我们将它定位在页面的右上角
    const photoSize = 100; // 照片尺寸与简历中相同

    if (!photoUrl || !loaded) return null;
    return (
      <div
        style={{
          position: "absolute",
          right: `calc(50% - ${240 * scale}px)`, // 更改为更大的值，向右移动
          top: `calc(8% + ${-50 * scale}px)`, // 减小顶部边距，向上移动
          width: `${photoSize * scale}px`,
          height: `${photoSize * scale}px`,
          borderRadius: "4px",
          overflow: "hidden",
          zIndex: 10, // 确保照片在最上层
          pointerEvents: "none", // 让点击事件穿透到下面的元素
        }}
      >
        <Image
          src={photoUrl}
          alt="简历照片"
          width={photoSize}
          height={photoSize}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            display: "block",
          }}
          priority
        />
      </div>
    );
  }
);

StableProfilePhoto.displayName = "StableProfilePhoto";

export const AutoTypingResume = () => {
  const { language } = useLanguage();

  // 根据当前语言获取对应的示例简历
  const endResume = getResumeByLang(language);

  // 创建不包含photoUrl属性的起始简历和结束简历
  const modifiedStartResume = React.useMemo(
    () => ({
      ...START_HOME_RESUME,
      profile: {
        ...START_HOME_RESUME.profile,
        photoUrl: "", // 清空照片URL，我们会使用单独的组件显示照片
      },
    }),
    []
  );

  // 单独保存照片URL
  const photoUrl = React.useMemo(
    () => endResume.profile.photoUrl,
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
  }, [photoUrl]);

  // 确保在组件卸载时清除interval
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 创建一个自定义的简历更新函数，确保不包含照片
  const createResumeWithoutImage = useCallback(
    (currentResume: any, updatedResume: any) => {
      // 深度克隆更新后的简历
      const result = deepClone(updatedResume);

      // 确保清除照片URL，使用单独的组件显示照片
      if (result.profile) {
        result.profile = {
          ...result.profile,
          photoUrl: "", // 清空照片URL
        };
      }

      return result;
    },
    []
  );

  // 当语言改变时更新简历
  useEffect(() => {
    if (isComplete) {
      const currentEndResume = getResumeByLang(language);
      // 创建一个不含照片的结束简历
      const finalResume = {
        ...currentEndResume,
        profile: {
          ...currentEndResume.profile,
          photoUrl: "",
        },
      };
      setResume(finalResume);
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

    // 获取当前语言的简历，但不包含照片
    const currentEndResume = {
      ...getResumeByLang(language),
      profile: {
        ...getResumeByLang(language).profile,
        photoUrl: "",
      },
    };

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
      const updatedResume = createResumeWithoutImage(
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
        const updatedResume = createResumeWithoutImage(
          modifiedStartResume,
          iter.value
        );
        setResume(updatedResume);
      }
    }, INTERVAL_MS);
  }, [modifiedStartResume, language, createResumeWithoutImage]);

  // 当语言变化时重启打字效果
  useEffect(() => {
    if (md && imagesPreloaded) {
      restartTypingEffect();
    } else if (!md) {
      // 在移动端直接显示完整简历，但不包含照片
      const currentEndResume = getResumeByLang(language);
      const finalResume = {
        ...currentEndResume,
        profile: {
          ...currentEndResume.profile,
          photoUrl: "",
        },
      };
      setResume(finalResume);
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

  const scale = getScaleForScreen();

  // 创建简历PDF组件
  const resumePDF = (
    <ResumePDF resume={resume} settings={settings} isPDF={false} />
  );

  return (
    <div className="relative mt-4 sm:mt-6 md:mt-10">
      <div className="absolute -top-10 left-0 right-0 flex justify-center sm:-top-12">
        <TemplateSelector
          templates={templates}
          currentTemplate={settings.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      <div className="relative mx-auto max-w-full">
        {/* 独立的稳定照片组件，位于简历iframe之外 */}
        <StableProfilePhoto photoUrl={photoUrl} scale={scale} />

        <ResumeIframeCSR
          documentSize="A4"
          scale={scale}
          enablePDFViewer={false}
          showToolbar={false}
        >
          {resumePDF}
        </ResumeIframeCSR>
      </div>
    </div>
  );
};
