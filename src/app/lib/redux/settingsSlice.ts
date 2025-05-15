import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  template: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
}

export type ShowForm = keyof Settings["formToShow"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "formToShow" | "formToHeading" | "formsOrder"
>;

export const DEFAULT_THEME_COLOR = "#38bdf8"; // sky-400
export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "11"; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = "#000000"; // text-neutral-800
export const DEFAULT_TEMPLATE = "elegant"; // 默认模板

// 为了适应不同语言环境的初始表单标题
export const formHeadings = {
  zh: {
    workExperiences: "工作经历",
    educations: "教育经历",
    projects: "项目经历",
    skills: "技能",
    custom: "自定义部分",
  },
  en: {
    workExperiences: "Work Experience",
    educations: "Education",
    projects: "Projects",
    skills: "Skills",
    custom: "Custom Section",
  },
};

// 从localStorage获取当前语言设置或者使用默认值
function getCurrentLanguage(): "zh" | "en" {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      return savedLanguage;
    }
  }
  return "zh"; // 默认使用中文
}

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "A4", // 将默认值从 "Letter" 改为 "A4",因为日常使用确实是a4
  template: DEFAULT_TEMPLATE,
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    // 根据语言设置初始表单标题，默认使用中文
    ...formHeadings.zh,
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    changeSettings: (
      draft,
      action: PayloadAction<{ field: GeneralSetting; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft[field] = value;
    },
    changeShowForm: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: boolean }>
    ) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.formToHeading[field] = value;
    },
    changeFormOrder: (
      draft,
      action: PayloadAction<{ form: ShowForm; type: "up" | "down" }>
    ) => {
      const { form, type } = action.payload;
      const lastIdx = draft.formsOrder.length - 1;
      const pos = draft.formsOrder.indexOf(form);
      const newPos = type === "up" ? pos - 1 : pos + 1;
      const swapFormOrder = (idx1: number, idx2: number) => {
        const temp = draft.formsOrder[idx1];
        draft.formsOrder[idx1] = draft.formsOrder[idx2];
        draft.formsOrder[idx2] = temp;
      };
      if (newPos >= 0 && newPos <= lastIdx) {
        swapFormOrder(pos, newPos);
      }
    },
    setSettings: (draft, action: PayloadAction<Settings>) => {
      return action.payload;
    },
  },
});

export const {
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  setSettings,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;

export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToShow[form];

export const selectFormToHeading = (state: RootState) =>
  state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToHeading[form];

export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

// Lexical 编辑器支持通过 Markdown 快捷方式自动转换为列表，不再需要 showBulletPoints

export default settingsSlice.reducer;
