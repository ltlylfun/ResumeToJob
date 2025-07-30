import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeEducations,
  selectEducations,
} from "lib/redux/resumeManagerSlice";
import type { ResumeEducation } from "lib/redux/types";
import { updateFormHeadingIfNotCustomized } from "lib/redux/settingsSlice";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const showDelete = educations.length > 1;
  const form = "educations";

  const translate = useCallback(
    (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        educations: {
          en: "Education",
          zh: "教育经历",
        },
        addEducation: {
          en: "Add Education",
          zh: "添加教育经历",
        },
        deleteEducation: {
          en: "Delete Education",
          zh: "删除教育经历",
        },
        school: {
          en: "School",
          zh: "学校",
        },
        degree: {
          en: "Degree",
          zh: "学位",
        },
        gpa: {
          en: "GPA",
          zh: "GPA",
        },
        date: {
          en: "Date",
          zh: "日期",
        },
        descriptions: {
          en: "Descriptions",
          zh: "描述",
        },
        showBulletPoints: {
          en: "Show bullet points",
          zh: "显示项目符号",
        },
      };

      return translations[key]?.[language] || key;
    },
    [language],
  );

  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: form,
        value: translate("educations"),
      }),
    );
  }, [dispatch, language, form, translate]);

  return (
    <Form form={form} addButtonText={translate("addEducation")}>
      {educations.map(
        ({ id, school, degree, gpa, date, descriptions }, idx) => {
          const handleEducationChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
          ) => {
            dispatch(changeEducations({ idx, field, value } as any));
          };

          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== educations.length - 1;

          return (
            <FormSection
              key={id || `education-${idx}`}
              form="educations"
              idx={idx}
              showMoveUp={showMoveUp}
              showMoveDown={showMoveDown}
              showDelete={showDelete}
              deleteButtonTooltipText={translate("deleteEducation")}
            >
              <Input
                label={translate("school")}
                labelClassName="col-span-4"
                name="school"
                placeholder=""
                value={school}
                onChange={handleEducationChange}
              />
              <Input
                label={translate("date")}
                labelClassName="col-span-2"
                name="date"
                placeholder=""
                value={date}
                onChange={handleEducationChange}
              />
              <Input
                label={translate("degree")}
                labelClassName="col-span-4"
                name="degree"
                placeholder=""
                value={degree}
                onChange={handleEducationChange}
              />
              <Input
                label={translate("gpa")}
                labelClassName="col-span-2"
                name="gpa"
                placeholder=""
                value={gpa}
                onChange={handleEducationChange}
              />{" "}
              <div className="col-span-full">
                <BulletListTextarea
                  label={
                    language === "en"
                      ? "Additional Information (Optional)"
                      : "附加信息（可选）"
                  }
                  labelClassName="col-span-full"
                  name="descriptions"
                  placeholder={
                    language === "en"
                      ? "Supports Markdown, see editor instructions for details"
                      : "支持Markdown，详见编辑器使用说明"
                  }
                  value={descriptions}
                  onChange={handleEducationChange}
                />
              </div>
            </FormSection>
          );
        },
      )}
    </Form>
  );
};
