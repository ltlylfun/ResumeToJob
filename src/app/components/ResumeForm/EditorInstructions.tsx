"use client";
import React, { useState } from "react";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

export const EditorInstructions = () => {
  const { language } = useLanguageRedux();
  const [isExpanded, setIsExpanded] = useState(false);
  // 翻译内容
  const translations: Record<string, Record<"en" | "zh", string>> = {
    title: {
      en: "Editor Instructions",
      zh: "编辑器使用说明",
    },
    toggle: {
      en: isExpanded ? "Hide Instructions" : "Show Instructions",
      zh: isExpanded ? "隐藏说明" : "显示说明",
    },
    markdown: {
      en: "Markdown Shortcuts",
      zh: "Markdown 快捷方式",
    },
    unorderedList: {
      en: "Type '- ' or '* ' to create an unordered list (note the space after)",
      zh: "输入 '- ' 或 '* ' 创建无序列表（注意后面的空格）",
    },
    orderedList: {
      en: "Type '1. ' to create an ordered list (note the space after)",
      zh: "输入 '1. ' 创建有序列表（注意后面的空格）",
    },
    boldText: {
      en: "Type '**text**' or '__text__' to make text bold",
      zh: "输入 '**文本**' 或 '__文本__' 创建粗体文本",
    },
    autoList: {
      en: "When you press Enter at the end of a list item, a new list item is automatically created. Press Enter again to cancel the auto-list.",
      zh: "换行时默认会添加相同的 Markdown 列表项，按回车键可取消自动添加列表。",
    },
    hint: {
      en: "These shortcuts help you format your resume content more efficiently.",
      zh: "这些快捷方式可以帮助您更高效地格式化您的简历内容。",
    },
    resumeManagement: {
      en: "Resume Management",
      zh: "简历管理",
    },
    resumeManagementDesc: {
      en: "Support for creating, switching, cloning, and importing/exporting multiple resumes",
      zh: "支持多份简历创建、切换、克隆和导入导出",
    },
  };

  return (
    <div className="mb-6 rounded-md bg-blue-50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-blue-800">
          {translations.title[language]}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          {translations.toggle[language]}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3">
          <h4 className="mb-2 font-medium text-blue-700">
            {translations.markdown[language]}
          </h4>
          <ul className="list-disc space-y-2 pl-5 text-blue-700">
            <li>{translations.unorderedList[language]}</li>
            <li>{translations.orderedList[language]}</li>
            <li>{translations.boldText[language]}</li>
            <li>{translations.autoList[language]}</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            {translations.hint[language]}
          </p>

          <div className="mt-4 border-t border-blue-200 pt-3">
            <h4 className="mb-2 font-medium text-blue-700">
              {translations.resumeManagement[language]}
            </h4>
            <p className="text-sm text-blue-700">
              {translations.resumeManagementDesc[language]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
