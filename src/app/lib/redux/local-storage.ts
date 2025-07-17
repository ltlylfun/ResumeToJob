import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

export const LOCAL_STORAGE_KEY = "resume-to-job-state";

// 检查 localStorage 是否可用（在某些隐私模式下可能不可用）
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
    // 确保只在浏览器环境中访问localStorage，并且localStorage可用
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

    // 验证数据结构的基本完整性
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
    // 如果是解析错误，清除损坏的数据
    if (e instanceof SyntaxError) {
      console.warn("localStorage 中的数据已损坏，将清除并使用默认状态");
      clearLocalStorage();
    }
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    // 确保只在浏览器环境中访问localStorage，并且localStorage可用
    if (!isLocalStorageAvailable()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("localStorage 不可用，无法保存状态");
      }
      return;
    }

    // 检查状态对象是否为空
    if (!state || Object.keys(state).length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn("尝试保存空状态到 localStorage，操作已跳过");
      }
      return;
    }

    const stringifiedState = JSON.stringify(state);

    // 检查序列化后的状态大小是否超过限制（大约5MB）
    const stateSize = new Blob([stringifiedState]).size;
    if (stateSize > 4 * 1024 * 1024) {
      // 4MB 警告阈值
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `状态大小(${Math.round(
            stateSize / 1024 / 1024,
          )}MB)接近localStorage限制，这可能导致保存失败`,
        );
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);

    // 验证数据是否成功保存
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

// 清除 localStorage 中的应用状态
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
