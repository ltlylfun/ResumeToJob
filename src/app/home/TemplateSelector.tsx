"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "lib/cx";
import type { Template } from "components/Resume/ResumePDF/templates";
import { useLanguage } from "../i18n/LanguageContext";

interface TemplateSelectorProps {
  templates: Template[];
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  currentTemplate,
  onTemplateChange,
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const { language } = useLanguage();

  // 翻译函数，处理所有文本内容
  const translate = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      switchTemplate: {
        en: "Switch Template",
        zh: "切换模板",
      },
    };

    // 所有模板翻译
    const templateTranslations: Record<string, Record<string, string>> = {
      elegant: {
        en: "Elegant",
        zh: "优雅",
      },
      modern: {
        en: "Modern",
        zh: "现代",
      },
      minimal: {
        en: "Minimal",
        zh: "简约",
      },
      professional: {
        en: "Professional",
        zh: "专业",
      },
      classic: {
        en: "Classic",
        zh: "经典",
      },
      creative: {
        en: "Creative",
        zh: "创意",
      },
      tech: {
        en: "Tech",
        zh: "科技",
      },
      compact: {
        en: "Compact",
        zh: "紧凑",
      },
    };

    // 处理嵌套的模板名称翻译
    if (key.startsWith("templates.")) {
      const templateId = key.split(".")[1];
      return templateTranslations[templateId]?.[language] || key;
    }

    return translations[key]?.[language] || key;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-sky-700 shadow-md transition-colors hover:bg-sky-50"
      >
        {translate("switchTemplate")}
      </button>

      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full z-10 mt-2 flex max-w-[300px] flex-wrap gap-2 overflow-x-auto rounded-lg bg-white p-2 shadow-lg"
          >
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onTemplateChange(template.id);
                  setShowSelector(false);
                }}
                className={cx(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
                  currentTemplate === template.id
                    ? "bg-sky-100 font-medium text-sky-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title={template.description}
              >
                {(() => {
                  // 使用本地翻译
                  const translatedName = translate(`templates.${template.id}`);
                  return translatedName === `templates.${template.id}`
                    ? template.name
                    : translatedName;
                })()}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
