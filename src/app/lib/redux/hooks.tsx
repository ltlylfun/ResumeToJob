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

export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    console.info("初始化 Redux 状态保存到 localStorage 的监听");

    const debouncedSave = debounce((state: RootState) => {
      saveStateToLocalStorage(state);
    }, 500);

    const unsubscribe = store.subscribe(() => {
      debouncedSave(store.getState());
    });

    return () => {
      unsubscribe();
      console.info("清理 Redux 状态变化监听");
    };
  }, []);
};

let storeInitialized = false;

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (storeInitialized) {
      console.info("Redux 存储已初始化，跳过重复操作");
      return;
    }

    console.info("开始初始化 Redux 存储");

    try {
      storeInitialized = true;
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

      const getCurrentLanguage = (): "zh" | "en" => {
        if (state?.language?.current) {
          return state.language.current;
        }
        return "zh";
      };
      const currentLanguage = getCurrentLanguage();
      const languageHeadings = formHeadings[currentLanguage] || formHeadings.zh;

      if (state?.settings) {
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
        dispatch(
          setSettings({
            ...initialSettings,
            formToHeading: languageHeadings,
          }),
        );
      }

      if (state?.resumeManager) {
        const resumeManager = state.resumeManager;
        if (resumeManager.resumes && Array.isArray(resumeManager.resumes)) {
          console.info(`恢复 ${resumeManager.resumes.length} 个简历`);
          dispatch(setAllResumes(resumeManager));
        } else {
          console.warn("简历数据格式不正确，创建默认简历");
          dispatch(createResume({ title: "default" }));
        }
      } else {
        console.info("创建默认简历");
        dispatch(createResume({ title: "default" }));
      }

      console.info("Redux 存储初始化完成");
    } catch (error) {
      console.error("初始化 Redux 存储时发生错误:", error);
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
