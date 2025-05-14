"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const { language } = useLanguageRedux();

  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      importFromExisting: {
        en: "Import data from existing resume",
        zh: "从现有简历导入数据",
      },
      noResume: {
        en: "Don't have a resume yet?",
        zh: "还没有简历？",
      },
      createFromScratch: {
        en: "Create from scratch",
        zh: "从头开始创建",
      },
      savedSession: {
        en: "Your previous session data is saved in the browser",
        zh: "浏览器中保存了您之前的会话数据",
      },
      continueWork: {
        en: "Continue your work",
        zh: "继续上次的工作",
      },
      overrideData: {
        en: "Override data with a new resume",
        zh: "使用新简历覆盖数据",
      },
      or: {
        en: "or",
        zh: "或",
      },
    };

    return translations[key]?.[language] || key;
  };
  return (
    <main>
      <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              {translate("importFromExisting")}
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />{" "}
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading={translate("noResume")}
                  buttonText={translate("createFromScratch")}
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                {" "}
                <SectionWithHeadingAndCreateButton
                  heading={translate("savedSession")}
                  buttonText={translate("continueWork")}
                />
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold text-gray-900">
              {translate("overrideData")}
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => {
  const { language } = useLanguageRedux();
  const orText = language === "en" ? "or" : "或";

  return (
    <div
      className="mx-[-2.5rem] flex items-center pb-6 pt-8"
      aria-hidden="true"
    >
      <div className="flex-grow border-t border-gray-200" />
      <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">
        {orText}
      </span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
  );
};

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <>
      <p className="font-semibold text-gray-900">{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          className="outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
