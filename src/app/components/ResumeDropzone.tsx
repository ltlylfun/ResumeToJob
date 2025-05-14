import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const { language } = useLanguageRedux();
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonPdfFile, setHasNonPdfFile] = useState(false);
  const router = useRouter();

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      dragDrop: {
        en: "Drag & drop your resume PDF here",
        zh: "拖放您的简历PDF到这里",
      },
      or: {
        en: "or",
        zh: "或",
      },
      browse: {
        en: "Browse files",
        zh: "浏览文件",
      },
      privacy: {
        en: "Your data is secure and never leaves your device",
        zh: "您的数据安全，绝不会离开您的设备",
      },
      fileSize: {
        en: "File Size",
        zh: "文件大小",
      },
      remove: {
        en: "Remove",
        zh: "移除",
      },
      import: {
        en: "Import and Continue",
        zh: "导入并继续",
      },
      warning: {
        en: "Please upload a PDF file",
        zh: "请上传PDF文件",
      },
      note: {
        en: "Note: Parser works best on single-column resumes",
        zh: "注意：解析器对单列简历效果最佳",
      },
    };

    return translations[key]?.[language] || key;
  };

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile.name.endsWith(".pdf")) {
      setHasNonPdfFile(false);
      setNewFile(newFile);
    } else {
      setHasNonPdfFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    setNewFile(newFile);
  };

  const onRemove = () => {
    setFile(defaultFileState);
    onFileUrlChange("");
  };

  const onImportClick = async () => {
    const resume = await parseResumeFromPdf(file.fileUrl);
    const settings = deepClone(initialSettings);

    // Set formToShow settings based on uploaded resume if users have used the app before
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }
    }

    // 获取当前语言状态
    const state = loadStateFromLocalStorage() || {};
    saveStateToLocalStorage({
      resume,
      settings,
      language: state.language || { current: "zh" }, // 保持现有语言状态
    });
    router.push("/resume-builder");
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 ",
        isHoveredOnDropzone && "border-sky-400",
        hasFile ? "pb-6 pt-6" : "pb-10 pt-10",
        className ?? ""
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsHoveredOnDropzone(false);
      }}
      onDrop={onDrop}
    >
      <div className="text-center">
        {hasFile ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-sm font-semibold text-gray-500">
                {file.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {translate("fileSize")}: {getFileSizeString(file.size)}
                </span>
                <button
                  onClick={onRemove}
                  className="ml-1 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">{translate("remove")}</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            {!playgroundView && (
              <button
                type="button"
                className="btn-primary"
                onClick={onImportClick}
              >
                {translate("import")} <span aria-hidden="true">→</span>
              </button>
            )}
            <p className={cx(" text-gray-500", !playgroundView && "mt-6")}>
              {translate("note")}
            </p>
          </>
        ) : (
          <>
            <img
              src={addPdfSrc.src}
              className="mx-auto h-11 w-11"
              alt="Add PDF"
            />
            <div className="mt-3 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>
                  {hasNonPdfFile ? translate("warning") : translate("dragDrop")}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  onChange={onInputChange}
                />
              </label>
              <p className="pl-1">{translate("or")}</p>
              <label
                htmlFor="file-upload-browse"
                className="relative ml-1 cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>{translate("browse")}</span>
                <input
                  id="file-upload-browse"
                  name="file-upload-browse"
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  onChange={onInputChange}
                />
              </label>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <LockClosedIcon className="ml-3 h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-500">{translate("privacy")}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
