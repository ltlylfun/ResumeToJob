import { useEffect } from "react";
import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";
import {
  changeFormHeading,
  updateFormHeadingIfNotCustomized,
} from "lib/redux/settingsSlice";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      workExperiences: {
        en: "Work Experience",
        zh: "工作经历",
      },
      addWork: {
        en: "Add Work Experience",
        zh: "添加工作经历",
      },
      deleteWork: {
        en: "Delete Work Experience",
        zh: "删除工作经历",
      },
      company: {
        en: "Company",
        zh: "公司",
      },
      position: {
        en: "Position",
        zh: "职位",
      },
      date: {
        en: "Date",
        zh: "日期",
      },
      responsibilities: {
        en: "Responsibilities",
        zh: "职责描述",
      },
    };

    return translations[key]?.[language] || key;
  };
  const showDelete = workExperiences.length > 1;
  // 更新表单标题（仅在用户未自定义时）
  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: "workExperiences",
        value: translate("workExperiences"),
      })
    );
  }, [dispatch, language, translate]);

  return (
    <Form form="workExperiences" addButtonText={translate("addWork")}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={translate("deleteWork")}
          >
            {" "}
            <Input
              label={translate("company")}
              labelClassName="col-span-full"
              name="company"
              placeholder=""
              value={company}
              onChange={handleWorkExperienceChange}
            />{" "}
            <Input
              label={translate("position")}
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder=""
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />{" "}
            <Input
              label={translate("date")}
              labelClassName="col-span-2"
              name="date"
              placeholder=""
              value={date}
              onChange={handleWorkExperienceChange}
            />{" "}
            <BulletListTextarea
              label={translate("responsibilities")}
              labelClassName="col-span-full"
              name="descriptions"
              placeholder={
                language === "en"
                  ? "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed"
                  : "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消"
              }
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
