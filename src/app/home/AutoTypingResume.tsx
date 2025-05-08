"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { deepClone } from "lib/deep-clone";
import { getAllTemplates } from "components/Resume/ResumePDF/templates";
import { TemplateSelector } from "home/TemplateSelector";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 50; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 10;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s

export const AutoTypingResume = () => {
  const [resume, setResume] = useState(START_HOME_RESUME);
  const [settings, setSettings] = useState({
    ...initialSettings,
    template: "classic", // 默认使用经典模板
    themeColor: "#0ea5e9", // 设置默认主题颜色
  });
  const [isComplete, setIsComplete] = useState(false);
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // On mobile, just show the completed resume
    if (!md) {
      setResume(END_HOME_RESUME);
      setIsComplete(true);
      return;
    }

    // Auto type resume with interval
    const resumeCharIterator = makeObjectCharIterator(
      START_HOME_RESUME,
      END_HOME_RESUME,
      CHARS_PER_INTERVAL
    );
    let iter = resumeCharIterator.next();

    if (!iter.done) {
      setResume(iter.value);
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
        setResume(iter.value);
      }
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [md]);

  return (
    <div className="relative mt-10 ">
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
