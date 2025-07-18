import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { selectLanguage, setLanguage } from "lib/redux/languageSlice";
import type { SupportedLanguage } from "../redux/types";

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
