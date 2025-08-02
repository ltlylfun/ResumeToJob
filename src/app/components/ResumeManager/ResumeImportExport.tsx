import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllResumes, importResumes } from "lib/redux/resumeManagerSlice";
import type { AppDispatch } from "lib/redux/store";
import type { ResumeData } from "lib/redux/types";
import { useLanguageRedux } from "lib/hooks/useLanguageRedux";

export const ResumeImportExport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useLanguageRedux();
  const allResumes = useSelector(selectAllResumes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      "export-all": { zh: "导出所有简历", en: "Export All Resumes" },
      "import-resumes": { zh: "导入简历", en: "Import Resumes" },
      "export-success": {
        zh: "简历数据已成功导出！",
        en: "Resume data exported successfully!",
      },
      "import-success": {
        zh: "简历数据导入成功！",
        en: "Resume data imported successfully!",
      },
      "import-error": {
        zh: "导入失败，请检查文件格式",
        en: "Import failed, please check file format",
      },
      "no-resumes-to-export": {
        zh: "没有简历可以导出",
        en: "No resumes to export",
      },
    };
    return translations[key]?.[language] || key;
  };

  const handleExportAll = () => {
    if (allResumes.length === 0) {
      alert(t("no-resumes-to-export"));
      return;
    }

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      resumes: allResumes,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `resumetojob_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(t("export-success"));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (data.resumes && Array.isArray(data.resumes)) {
          if (data.version && data.version !== "1.0") {
            console.warn(`导入数据版本 ${data.version} 可能不兼容当前版本 1.0`);
          }

          const validResumes: ResumeData[] = data.resumes.filter(
            (resume: any) => resume.metadata && resume.content,
          );

          if (validResumes.length > 0) {
            dispatch(importResumes(validResumes));
            alert(
              `${t("import-success")} 导入了 ${validResumes.length} 份简历。`,
            );
          } else {
            throw new Error("No valid resumes found");
          }
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        console.error("Import error:", error);
        alert(t("import-error"));
      }
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportAll}
        className="rounded-lg border border-green-600 bg-white px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50"
        title={t("export-all")}
        disabled={allResumes.length === 0}
      >
        {t("export-all")}
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-50"
        title={t("import-resumes")}
      >
        {t("import-resumes")}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
