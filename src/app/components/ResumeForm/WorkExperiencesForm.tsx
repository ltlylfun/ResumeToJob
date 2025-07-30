import { useEffect, useCallback } from "react";
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
} from "lib/redux/resumeManagerSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";
import { updateFormHeadingIfNotCustomized } from "lib/redux/settingsSlice";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();

  const translate = useCallback(
    (key: string) => {
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
    },
    [language],
  );
  const showDelete = workExperiences.length > 1;

  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: "workExperiences",
        value: translate("workExperiences"),
      }),
    );
  }, [dispatch, language, translate]);

  return (
    <Form form="workExperiences" addButtonText={translate("addWork")}>
      {workExperiences.map(
        ({ id, company, jobTitle, date, descriptions }, idx) => {
          const handleWorkExperienceChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
          ) => {
            dispatch(changeWorkExperiences({ idx, field, value } as any));
          };
          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== workExperiences.length - 1;

          return (
            <FormSection
              key={id || `work-${idx}`}
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
                    ? "Supports Markdown, see editor instructions for details"
                    : "支持Markdown，详见编辑器使用说明"
                }
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
            </FormSection>
          );
        },
      )}
    </Form>
  );
};
