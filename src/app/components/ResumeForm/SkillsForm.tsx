import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import {
  selectThemeColor,
  changeFormHeading,
  updateFormHeadingIfNotCustomized,
} from "lib/redux/settingsSlice";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";

  const translate = useCallback(
    (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        skills: {
          en: "Skills",
          zh: "技能",
        },
        skillsList: {
          en: "Skills List",
          zh: "技能列表",
        },
        skillsItem: {
          en: "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed\nInput '**text**' or '__text__' to make text bold",
          zh: "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消\n输入 '**文本**' 或 '__文本__' 创建粗体文本",
        },
        featuredSkills: {
          en: "Featured Skills (Optional)",
          zh: "特色技能（可选）",
        },
        featuredSkillsDescription: {
          en: "Featured skills are optional and highlight your top skills. More circles indicate higher proficiency.",
          zh: "特色技能是可选项，用于突出您的顶级技能，圆圈越多表示熟练度越高。",
        },
        featuredSkillPlaceholder: {
          en: "Featured Skill",
          zh: "特色技能",
        },
      };

      return translations[key]?.[language] || key;
    },
    [language]
  );
  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };
  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };

  // 更新表单标题（仅在用户未自定义时）
  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: form,
        value: translate("skills"),
      })
    );
  }, [dispatch, language, form, translate]);

  return (
    <Form form={form}>
      {" "}
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="col-span-full">
          <BulletListTextarea
            label={translate("skillsList")}
            labelClassName="col-span-full"
            name="descriptions"
            placeholder={translate("skillsItem")}
            value={descriptions}
            onChange={handleSkillsChange}
          />
        </div>
        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <InputGroupWrapper
          label={translate("featuredSkills")}
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            {translate("featuredSkillsDescription")}
          </p>
        </InputGroupWrapper>

        {featuredSkills.map(({ skill, rating }, idx) => (
          <FeaturedSkillInput
            key={idx}
            className="col-span-3"
            skill={skill}
            rating={rating}
            setSkillRating={(newSkill, newRating) => {
              handleFeaturedSkillsChange(idx, newSkill, newRating);
            }}
            placeholder={`${translate("featuredSkillPlaceholder")} ${idx + 1}`}
            circleColor={themeColor}
          />
        ))}
      </div>
    </Form>
  );
};
