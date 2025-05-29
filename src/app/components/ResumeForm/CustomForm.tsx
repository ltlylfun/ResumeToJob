import { Form } from "components/ResumeForm/Form";
import { BulletListTextarea } from "components/ResumeForm/Form/InputGroup";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom } from "lib/redux/resumeSlice";
import {
  changeFormHeading,
  updateFormHeadingIfNotCustomized,
} from "lib/redux/settingsSlice";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const { descriptions } = custom;
  const form = "custom";

  const translate = useCallback(
    (key: string) => {
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
          en: "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed",
          zh: "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消",
        },
      };

      return translations[key]?.[language] || key;
    },
    [language]
  );
  const handleCustomChange = (field: "descriptions", value: string[]) => {
    dispatch(changeCustom({ field, value }));
  };
  // 更新表单标题（仅在用户未自定义时）
  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: form,
        value: translate("custom"),
      })
    );
  }, [dispatch, language, form, translate]);

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        {" "}
        <div className="col-span-full">
          <BulletListTextarea
            label={translate("customContent")}
            labelClassName="col-span-full"
            name="descriptions"
            placeholder={translate("addCustomContent")}
            value={descriptions}
            onChange={handleCustomChange}
          />
        </div>
      </div>
    </Form>
  );
};
