"use client";
import { useState, useEffect } from "react";
import {
  useAppSelector,
  useAppDispatch,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import {
  ShowForm,
  selectFormsOrder,
  changeFormHeading,
} from "lib/redux/settingsSlice";
import { EditorInstructions } from "./EditorInstructions";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { cx } from "lib/cx";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  // 移除重复的 useSaveStateToLocalStorageOnChange，因为已经在 providers.tsx 中调用了

  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);
  const { language } = useLanguageRedux();
  const dispatch = useAppDispatch();

  // 初始化所有表单标题
  useEffect(() => {
    // 根据当前语言设置所有表单标题
    const updateFormHeadings = () => {
      const translations: Record<ShowForm, Record<string, string>> = {
        workExperiences: {
          en: "Work Experience",
          zh: "工作经历",
        },
        educations: {
          en: "Education",
          zh: "教育经历",
        },
        projects: {
          en: "Projects",
          zh: "项目经历",
        },
        skills: {
          en: "Skills",
          zh: "技能",
        },
        custom: {
          en: "Custom Section",
          zh: "自定义部分",
        },
      };

      // 为每个表单设置正确的标题
      Object.entries(translations).forEach(([form, texts]) => {
        dispatch(
          changeFormHeading({
            field: form as ShowForm,
            value: texts[language] || texts["zh"],
          })
        );
      });
    };

    updateFormHeadings();
  }, [dispatch, language]);
  return (
    <div
      className={cx(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <EditorInstructions />
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        <ThemeForm />
        <br />
      </section>
      <FlexboxSpacer maxWidth={30} className="hidden md:block" />{" "}
      {/* 从50减小到30 */}
    </div>
  );
};
