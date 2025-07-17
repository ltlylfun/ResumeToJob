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
import {
  initialSettings,
  setSettings,
  formHeadings,
  type Settings,
  type ShowForm,
} from "lib/redux/settingsSlice";
import { setAllResumes, createResume } from "lib/redux/resumeManagerSlice";
import { deepMerge } from "lib/deep-merge";

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
  delay: number,
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

    try {
      // 标记为已初始化
      storeInitialized = true;

      // 从 localStorage 加载状态
      const state = loadStateFromLocalStorage();

      if (state) {
        console.info("从 localStorage 恢复状态", {
          hasResumeManager: !!state.resumeManager,
          resumeCount: state.resumeManager?.resumes?.length || 0,
          currentResumeId: state.resumeManager?.currentResumeId,
          hasSettings: !!state.settings,
          hasLanguage: !!state.language,
        });
      } else {
        console.info("localStorage 中没有找到保存的状态，将创建默认状态");
      }

      // 获取当前语言（从Redux状态中获取，如果没有则使用默认值）
      const getCurrentLanguage = (): "zh" | "en" => {
        // 优先从Redux状态中获取语言设置
        if (state?.language?.current) {
          return state.language.current;
        }
        return "zh"; // 默认使用中文
      };
      const currentLanguage = getCurrentLanguage();

      // 根据当前语言选择正确的标题
      const languageHeadings = formHeadings[currentLanguage] || formHeadings.zh;

      // 初始化设置
      if (state?.settings) {
        // 处理现有设置，保留用户自定义的标题
        const updatedFormToHeading = { ...languageHeadings };

        if (state.settings.customizedHeadings && state.settings.formToHeading) {
          (
            Object.keys(state.settings.customizedHeadings) as ShowForm[]
          ).forEach((formKey) => {
            if (
              state.settings.customizedHeadings[formKey] &&
              state.settings.formToHeading[formKey]
            ) {
              updatedFormToHeading[formKey] =
                state.settings.formToHeading[formKey];
            }
          });
        }

        const settingsWithLanguage = {
          ...state.settings,
          formToHeading: updatedFormToHeading,
        };

        const mergedSettingsState = deepMerge(
          initialSettings,
          settingsWithLanguage,
        ) as Settings;
        dispatch(setSettings(mergedSettingsState));
      } else {
        // 使用默认设置
        dispatch(
          setSettings({
            ...initialSettings,
            formToHeading: languageHeadings,
          }),
        );
      }

      // 初始化简历管理状态
      if (state?.resumeManager) {
        // 验证简历数据的完整性
        const resumeManager = state.resumeManager;
        if (resumeManager.resumes && Array.isArray(resumeManager.resumes)) {
          console.info(`恢复 ${resumeManager.resumes.length} 个简历`);
          dispatch(setAllResumes(resumeManager));
        } else {
          console.warn("简历数据格式不正确，创建默认简历");
          dispatch(createResume({ title: "default" }));
        }
      } else {
        // 创建默认简历
        console.info("创建默认简历");
        dispatch(createResume({ title: "default" }));
      }

      console.info("Redux 存储初始化完成");
    } catch (error) {
      console.error("初始化 Redux 存储时发生错误:", error);
      // 发生错误时，重置标志并创建默认状态
      storeInitialized = false;
      try {
        dispatch(createResume({ title: "default" }));
        console.info("已创建默认简历作为备用");
      } catch (fallbackError) {
        console.error("创建默认简历失败:", fallbackError);
      }
    }
  }, [dispatch]);
};
