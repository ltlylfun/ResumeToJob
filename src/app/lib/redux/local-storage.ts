import type { RootState } from "lib/redux/store";

export const LOCAL_STORAGE_KEY = "resume-to-job-state";
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === "undefined") return false;

    const testKey = "__test_key__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const loadStateFromLocalStorage = () => {
  try {
    if (!isLocalStorageAvailable()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("localStorage 不可用，无法加载状态");
      }
      return undefined;
    }

    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stringifiedState) {
      if (process.env.NODE_ENV === "development") {
        console.info("localStorage 中没有找到保存的状态");
      }
      return undefined;
    }

    const parsedState = JSON.parse(stringifiedState);

    if (parsedState && typeof parsedState === "object") {
      if (process.env.NODE_ENV === "development") {
        console.info("成功从 localStorage 加载状态");
      }
      return parsedState;
    } else {
      console.warn("localStorage 中的数据格式不正确，将清除并使用默认状态");
      clearLocalStorage();
      return undefined;
    }
  } catch (e) {
    console.error("从 localStorage 加载数据失败:", e);
    if (e instanceof SyntaxError) {
      console.warn("localStorage 中的数据已损坏，将清除并使用默认状态");
      clearLocalStorage();
    }
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    if (!isLocalStorageAvailable()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("localStorage 不可用，无法保存状态");
      }
      return;
    }

    if (!state || Object.keys(state).length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn("尝试保存空状态到 localStorage，操作已跳过");
      }
      return;
    }

    const stringifiedState = JSON.stringify(state);

    const stateSize = new Blob([stringifiedState]).size;
    if (stateSize > 4 * 1024 * 1024) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `状态大小(${Math.round(
            stateSize / 1024 / 1024,
          )}MB)接近localStorage限制，这可能导致保存失败`,
        );
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedData) {
      console.error("数据保存到 localStorage 后无法验证");
    } else if (process.env.NODE_ENV === "development") {
      console.info(
        `成功保存状态到 localStorage，大小: ${Math.round(stateSize / 1024)}KB`,
      );
    }
  } catch (e) {
    console.error("保存数据到 localStorage 失败:", e);
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.error("localStorage 配额已满，无法保存状态。请考虑减少状态大小");
    }
  }
};

export const clearLocalStorage = () => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.info("已清除 localStorage 中的应用状态");
    }
  } catch (e) {
    console.error("清除 localStorage 失败:", e);
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
