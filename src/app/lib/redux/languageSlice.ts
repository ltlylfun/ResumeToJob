import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { SupportedLanguage } from "./types";

// 判断是否在浏览器环境
const isBrowser = typeof window !== "undefined";

// 从本地存储或浏览器设置获取初始语言
function getInitialLanguage(): SupportedLanguage {
  if (!isBrowser) return "zh"; // 服务器端渲染默认使用中文

  try {
    // 尝试从localStorage获取
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      return savedLanguage as SupportedLanguage;
    }

    // 如果没有localStorage设置，尝试从浏览器语言偏好设置获取
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith("zh")) {
      return "zh";
    }

    // 默认返回英文
    return "en";
  } catch (error) {
    console.error("Failed to get browser language", error);
    return "zh"; // 默认中文
  }
}

interface LanguageState {
  current: SupportedLanguage;
}

const initialState: LanguageState = {
  current: "zh", // 默认值，将在客户端被实际初始值替换
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.current = action.payload;

      // 保存到本地存储
      if (isBrowser) {
        try {
          localStorage.setItem("language", action.payload);

          // 更新 HTML lang 属性
          document.documentElement.lang =
            action.payload === "zh" ? "zh-CN" : "en";
        } catch (error) {
          console.error("Failed to set language in localStorage", error);
        }
      }
    },
    initializeLanguage: (state) => {
      if (isBrowser) {
        state.current = getInitialLanguage();
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;

// 选择器
export const selectLanguage = (state: RootState) => state.language.current;

export default languageSlice.reducer;
