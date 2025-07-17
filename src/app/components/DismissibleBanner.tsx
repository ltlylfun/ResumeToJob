"use client";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export const DismissibleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguageRedux();

  useEffect(() => {
    const isDismissed = localStorage.getItem("banner-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("banner-dismissed", "true");
  };

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      bannerMessage: {
        en: "Resume data is stored in browser locally. To prevent accidental loss, it is recommended to use the [manage resumes] function to export and save.",
        zh: "简历数据存储在浏览器本地，以防意外情况丢失，建议使用【管理简历】功能导出保存",
      },
      close: {
        en: "Close",
        zh: "关闭",
      },
    };

    return translations[key]?.[language] || key;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative border-b border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between px-3 py-2 lg:px-12">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              {translate("bannerMessage")}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
            onClick={handleDismiss}
            aria-label={translate("close")}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
