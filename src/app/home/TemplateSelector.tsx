"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";
import type { Template } from "components/Resume/ResumePDF/templates";

export const TemplateSelector = ({
  templates,
  currentTemplate,
  onTemplateChange,
}: {
  templates: Template[];
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  // 找到当前模板
  const currentTemplateObj =
    templates.find((t) => t.id === currentTemplate) || templates[0];

  return (
    <div className="z-10 rounded-md bg-white shadow-md">
      <div
        className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="mr-2 text-sm text-gray-700">当前模板:</span>
        <span className="font-medium text-gray-900">
          {currentTemplateObj.name}
        </span>
        <ChevronRightIcon
          className={cx(
            "ml-2 h-5 w-5 text-gray-500 transition-transform",
            expanded ? "rotate-90" : ""
          )}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 p-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={cx(
                    "cursor-pointer rounded px-3 py-2 text-center text-sm transition-colors hover:bg-gray-100",
                    template.id === currentTemplate
                      ? "bg-blue-50 font-medium text-blue-700 hover:bg-blue-100"
                      : "text-gray-700"
                  )}
                  onClick={() => {
                    onTemplateChange(template.id);
                    setExpanded(false);
                  }}
                >
                  {template.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
