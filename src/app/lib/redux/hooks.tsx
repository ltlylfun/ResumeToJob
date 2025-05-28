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
  formHeadings,
  type Settings,
  type ShowForm,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to save store to local storage on store change
 */
/**
 * 使用防抖函数包装保存操作
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * 钩子: 在 Redux 状态变化时保存状态到 localStorage
 * 使用防抖以减少频繁写入
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    console.info("初始化 Redux 状态保存到 localStorage 的监听");

    // 从 localStorage 加载初始状态
    const initialState = loadStateFromLocalStorage();
    if (initialState) {
      console.info("应用启动时从 localStorage 恢复了状态");
    } else {
      console.info("localStorage 中没有找到初始状态，将使用默认状态");
    }

    // 使用防抖动函数包装保存操作，延迟500毫秒
    const debouncedSave = debounce((state: RootState) => {
      saveStateToLocalStorage(state);
    }, 500);

    const unsubscribe = store.subscribe(() => {
      debouncedSave(store.getState());
    });

    // 在组件卸载时取消订阅
    return () => {
      unsubscribe();
      console.info("清理 Redux 状态变化监听");
    };
  }, []);
};

// 用于跟踪是否已初始化的标志
let storeInitialized = false;

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 如果已初始化，则跳过
    if (storeInitialized) {
      console.info("Redux 存储已初始化，跳过重复操作");
      return;
    }

    console.info("开始初始化 Redux 存储");

    // 标记为已初始化
    storeInitialized = true;

    // 尝试从 localStorage 加载状态
    const state = loadStateFromLocalStorage();

    // 获取当前语言
    const getCurrentLanguage = (): "zh" | "en" => {
      if (typeof window !== "undefined") {
        try {
          const savedLanguage = localStorage.getItem("language");
          if (
            savedLanguage &&
            (savedLanguage === "zh" || savedLanguage === "en")
          ) {
            return savedLanguage;
          }
        } catch (e) {
          console.error("获取语言设置失败:", e);
        }
      }
      return "zh"; // 默认使用中文
    };
    const currentLanguage = getCurrentLanguage();

    // 根据当前语言选择正确的标题
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
      // 只为用户未自定义的标题设置语言标题，保留用户自定义的标题
      const updatedFormToHeading = { ...languageHeadings };

      // 如果存储的设置中有 customizedHeadings 和 formToHeading，则保留用户自定义的标题
      if (state.settings.customizedHeadings && state.settings.formToHeading) {
        (Object.keys(state.settings.customizedHeadings) as ShowForm[]).forEach(
          (formKey) => {
            if (
              state.settings.customizedHeadings[formKey] &&
              state.settings.formToHeading[formKey]
            ) {
              updatedFormToHeading[formKey] =
                state.settings.formToHeading[formKey];
            }
          }
        );
      }

      const settingsWithLanguage = {
        ...state.settings,
        formToHeading: updatedFormToHeading,
      };

      const mergedSettingsState = deepMerge(
        initialSettings,
        settingsWithLanguage
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, [dispatch]);
};
