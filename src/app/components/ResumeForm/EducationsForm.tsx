import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeFormHeading,
  updateFormHeadingIfNotCustomized,
} from "lib/redux/settingsSlice";
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
    [language]
  );
  // 更新表单标题（仅在用户未自定义时）
  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: form,
        value: translate("educations"),
      })
    );
  }, [dispatch, language, form, translate]);

  return (
    <Form form={form} addButtonText={translate("addEducation")}>
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
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
            key={idx}
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
                    ? "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed\nInput '**text**' or '__text__' to make text bold"
                    : "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消\n输入 '**文本**' 或 '__文本__' 创建粗体文本"
                }
                value={descriptions}
                onChange={handleEducationChange}
              />
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
