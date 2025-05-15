"use client";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export default function Create() {
  const { language } = useLanguageRedux();

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Resume Builder",
        zh: "简历构建器",
      },
      // 更多构建界面相关的翻译可以添加在这里
    };

    return translations[key]?.[language] || key;
  };
  return (
    <main className="relative h-full w-full overflow-hidden bg-gray-50">
      <div className="grid grid-cols-3 md:grid-cols-6">
        <div className="col-span-3">
          <ResumeForm />
        </div>
        <div className="col-span-3">
          <Resume />
        </div>
      </div>
    </main>
  );
}
