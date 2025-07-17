import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { SupportedLanguage } from "./types";

// 判断是否在浏览器环境
const isBrowser = typeof window !== "undefined";

// 更新 HTML lang 属性的公共函数
const updateHtmlLangAttribute = (language: SupportedLanguage) => {
  if (isBrowser) {
    try {
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    } catch (error) {
      console.error("Failed to set HTML lang attribute", error);
    }
  }
};

// 从浏览器设置获取初始语言（不再从localStorage读取，统一由Redux管理）
function getInitialLanguage(): SupportedLanguage {
  if (!isBrowser) return "zh"; // 服务器端渲染默认使用中文

  try {
    // 根据浏览器语言偏好智能选择
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith("zh") ? "zh" : "en";
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
      // 更新 HTML lang 属性
      updateHtmlLangAttribute(action.payload);
    },
    initializeLanguage: (state) => {
      if (isBrowser) {
        state.current = getInitialLanguage();
        // 同时更新 HTML lang 属性
        updateHtmlLangAttribute(state.current);
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;

// 选择器
export const selectLanguage = (state: RootState) => state.language.current;

export default languageSlice.reducer;
