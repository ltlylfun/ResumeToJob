import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  selectThemeColor,
  changeFormHeading,
} from "lib/redux/settingsSlice";
import { useLanguage } from "../../i18n/LanguageContext";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";

  const translate = (key: string) => {
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
        en: "Skills item",
        zh: "技能条目",
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
  };

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
  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  // 更新表单标题
  useEffect(() => {
    dispatch(changeFormHeading({ field: form, value: translate("skills") }));
  }, [dispatch, language, form]);

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label={translate("skillsList")}
            labelClassName="col-span-full"
            name="descriptions"
            placeholder={translate("skillsItem")}
            value={descriptions}
            onChange={handleSkillsChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[4.5rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
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
