import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { selectLanguage, setLanguage } from "lib/redux/languageSlice";
import type { SupportedLanguage } from "../redux/types";

// 封装语言相关的 Redux 操作，提供与原 useLanguage 类似的 API
export const useLanguageRedux = () => {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const changeLanguage = (lang: SupportedLanguage) => {
    dispatch(setLanguage(lang));
  };

  return {
    language,
    setLanguage: changeLanguage,
  };
};
