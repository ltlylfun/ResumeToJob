import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentResume,
  selectAllResumes,
} from "lib/redux/resumeManagerSlice";
import { ResumeManager } from "./index";
import { useLanguageRedux } from "lib/hooks/useLanguageRedux";

export const ResumeManagerButton: React.FC = () => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const { language } = useLanguageRedux();

  const currentResume = useSelector(selectCurrentResume);
  const allResumes = useSelector(selectAllResumes);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "manage-resumes": { zh: "管理简历", en: "Manage Resumes" },
      "current-resume": { zh: "当前简历", en: "Current Resume" },
      current: { zh: "当前", en: "Current" },
      "not-selected": { zh: "未选择", en: "Not Selected" },
      "resumes-count": { zh: "份简历", en: "resumes" },
      "manage-button": { zh: "管理简历", en: "Manage Resumes" },
      "quick-switch": { zh: "快速切换", en: "Quick Switch" },
      more: { zh: "更多", en: "more" },
    };
    return translations[key]?.[language] || key;
  };

  return (
    <div className="mb-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📁</span>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("manage-resumes")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("current")}:{" "}
              {currentResume?.metadata.title || t("not-selected")} (
              {allResumes.length} {t("resumes-count")})
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsManagerOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t("manage-button")}
        </button>
      </div>

      {/* 快捷操作区域 */}
      {allResumes.length > 1 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("quick-switch")}
          </p>
          <div className="flex flex-wrap gap-2">
            {allResumes.slice(0, 4).map((resume) => (
              <button
                key={resume.metadata.id}
                onClick={() => setIsManagerOpen(true)}
                className={`rounded-md px-3 py-1 text-xs transition-colors ${
                  resume.metadata.id === currentResume?.metadata.id
                    ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={resume.metadata.description || resume.metadata.title}
              >
                {resume.metadata.title}
              </button>
            ))}
            {allResumes.length > 4 && (
              <button
                onClick={() => setIsManagerOpen(true)}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200"
              >
                +{allResumes.length - 4} {t("more")}
              </button>
            )}
          </div>
        </div>
      )}

      <ResumeManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </div>
  );
};
