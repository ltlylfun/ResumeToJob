"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { getAllTemplates } from "components/Resume/ResumePDF/templates";
import { TemplateSelector } from "home/TemplateSelector";
import { deepClone } from "lib/deep-clone";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 16.6; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 28;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s

export const AutoTypingResume = () => {
  // 预先为起始状态添加照片，确保一开始就显示图片
  const modifiedStartResume = {
    ...START_HOME_RESUME,
    profile: {
      ...START_HOME_RESUME.profile,
      photoUrl: END_HOME_RESUME.profile.photoUrl,
    },
  };

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
    const photoUrl = END_HOME_RESUME.profile.photoUrl;

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
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 创建一个自定义的简历更新函数，确保图片在动画过程中不会被修改
  const createResumeWithPreservedImage = (
    currentResume: any,
    updatedResume: any
  ) => {
    // 深度克隆更新后的简历
    const result = deepClone(updatedResume);

    // 确保图片URL保持不变（使用最终图片）
    if (END_HOME_RESUME.profile?.photoUrl && result.profile) {
      result.profile.photoUrl = END_HOME_RESUME.profile.photoUrl;
    }

    return result;
  };

  useEffect(() => {
    // 确保图片已预加载完成并且在桌面端才开始打字效果
    if (!md || !imagesPreloaded) {
      if (!md) {
        // 在移动端直接显示完整简历
        setResume(END_HOME_RESUME);
        setIsComplete(true);
      }
      return;
    }

    // Auto type resume with interval
    const resumeCharIterator = makeObjectCharIterator(
      modifiedStartResume,
      END_HOME_RESUME,
      CHARS_PER_INTERVAL
    );
    let iter = resumeCharIterator.next();

    if (!iter.done) {
      // 使用自定义函数处理更新，确保图片不会闪烁
      const updatedResume = createResumeWithPreservedImage(resume, iter.value);
      setResume(updatedResume);
    }

    intervalRef.current = setInterval(() => {
      iter = resumeCharIterator.next();
      if (iter.done) {
        setIsComplete(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // 使用自定义函数处理更新，确保图片不会闪烁
        const updatedResume = createResumeWithPreservedImage(
          resume,
          iter.value
        );
        setResume(updatedResume);
      }
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [md, imagesPreloaded]);

  return (
    <div className="relative mt-10">
      <div className="absolute -top-12 left-0 right-0 flex justify-center">
        <TemplateSelector
          templates={templates}
          currentTemplate={settings.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>
      <ResumeIframeCSR
        documentSize="A4"
        scale={0.6}
        enablePDFViewer={false}
        showToolbar={false}
      >
        <ResumePDF resume={resume} settings={settings} isPDF={false} />
      </ResumeIframeCSR>
    </div>
  );
};
