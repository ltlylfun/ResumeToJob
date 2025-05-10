import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  changeFormHeading,
} from "lib/redux/settingsSlice";
import { useLanguage } from "../../i18n/LanguageContext";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const translate = (key: string) => {
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
  };

  // 更新表单标题
  useEffect(() => {
    dispatch(
      changeFormHeading({ field: form, value: translate("educations") })
    );
  }, [dispatch, language, form]);

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

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
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
            />
            <div className="relative col-span-full">
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
                    ? "List activities, courses, awards, etc."
                    : "可列出额外活动、课程、奖项等"
                }
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
