import { Form } from "components/ResumeForm/Form";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { BulletListTextarea } from "components/ResumeForm/Form/InputGroup";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom } from "lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  changeFormHeading,
} from "lib/redux/settingsSlice";
import { useLanguage } from "../../i18n/LanguageContext";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const { descriptions } = custom;
  const form = "custom";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      custom: {
        en: "Custom Section",
        zh: "自定义部分",
      },
      customContent: {
        en: "Custom Content",
        zh: "自定义内容",
      },
      addCustomContent: {
        en: "Add custom content",
        zh: "添加自定义内容",
      },
    };

    return translations[key]?.[language] || key;
  };

  const handleCustomChange = (field: "descriptions", value: string[]) => {
    dispatch(changeCustom({ field, value }));
  };

  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  // 更新表单标题
  useEffect(() => {
    dispatch(changeFormHeading({ field: form, value: translate("custom") }));
  }, [dispatch, language, form]);

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label={translate("customContent")}
            labelClassName="col-span-full"
            name="descriptions"
            placeholder={translate("addCustomContent")}
            value={descriptions}
            onChange={handleCustomChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
