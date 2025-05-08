"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";
import type { Template } from "components/Resume/ResumePDF/templates";

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

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-sky-700 shadow-md transition-colors hover:bg-sky-50"
      >
        切换模板
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
                {template.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
