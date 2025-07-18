import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { SupportedLanguage } from "./types";

const isBrowser = typeof window !== "undefined";

const updateHtmlLangAttribute = (language: SupportedLanguage) => {
  if (isBrowser) {
    try {
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    } catch (error) {
      console.error("Failed to set HTML lang attribute", error);
    }
  }
};

function getInitialLanguage(): SupportedLanguage {
  if (!isBrowser) return "zh";

  try {
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith("zh") ? "zh" : "en";
  } catch (error) {
    console.error("Failed to get browser language", error);
    return "zh";
  }
}

interface LanguageState {
  current: SupportedLanguage;
}

const initialState: LanguageState = {
  current: "zh",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.current = action.payload;
      updateHtmlLangAttribute(action.payload);
    },
    initializeLanguage: (state) => {
      if (isBrowser) {
        state.current = getInitialLanguage();
        updateHtmlLangAttribute(state.current);
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;

export const selectLanguage = (state: RootState) => state.language.current;

export default languageSlice.reducer;
