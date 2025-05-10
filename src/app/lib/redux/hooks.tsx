import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState());
    });
    return unsubscribe;
  }, []);
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();

    // 获取当前语言
    const getCurrentLanguage = (): "zh" | "en" => {
      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("language");
        if (
          savedLanguage &&
          (savedLanguage === "zh" || savedLanguage === "en")
        ) {
          return savedLanguage;
        }
      }
      return "zh"; // 默认使用中文
    }; // 当前语言
    const currentLanguage = getCurrentLanguage();

    // 根据当前语言选择正确的标题
    const { formHeadings } = require("./settingsSlice");
    const languageHeadings = formHeadings[currentLanguage] || formHeadings.zh;

    if (!state) {
      // 如果没有本地存储的状态，但有语言设置，则更新表单标题
      dispatch(
        setSettings({
          ...initialSettings,
          formToHeading: languageHeadings,
        })
      );
      return;
    }

    if (state.resume) {
      // We merge the initial state with the stored state to ensure
      // backward compatibility, since new fields might be added to
      // the initial state over time.
      const mergedResumeState = deepMerge(
        initialResumeState,
        state.resume
      ) as Resume;
      dispatch(setResume(mergedResumeState));
    }

    if (state.settings) {
      // 确保表单标题使用当前语言
      const settingsWithLanguage = {
        ...state.settings,
        formToHeading: languageHeadings,
      };

      const mergedSettingsState = deepMerge(
        initialSettings,
        settingsWithLanguage
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, [dispatch]);
};
