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

  customizedHeadings: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formsOrder: ShowForm[];
}

export type ShowForm = keyof Settings["formToShow"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "formToShow" | "formToHeading" | "customizedHeadings" | "formsOrder"
>;

export const DEFAULT_THEME_COLOR = "#38bdf8";
export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "11";
export const DEFAULT_FONT_COLOR = "#000000";
export const DEFAULT_TEMPLATE = "minimal";
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

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "A4",
  template: DEFAULT_TEMPLATE,
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    ...formHeadings.zh,
  },
  customizedHeadings: {
    workExperiences: false,
    educations: false,
    projects: false,
    skills: false,
    custom: false,
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    changeSettings: (
      draft,
      action: PayloadAction<{ field: GeneralSetting; value: string }>,
    ) => {
      const { field, value } = action.payload;
      draft[field] = value;
    },
    changeShowForm: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: boolean }>,
    ) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (
      draft,
      action: PayloadAction<{
        field: ShowForm;
        value: string;
        isUserCustomized?: boolean;
      }>,
    ) => {
      const { field, value, isUserCustomized = true } = action.payload;
      draft.formToHeading[field] = value;
      if (isUserCustomized) {
        draft.customizedHeadings[field] = true;
      }
    },
    updateFormHeadingIfNotCustomized: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: string }>,
    ) => {
      const { field, value } = action.payload;
      if (!draft.customizedHeadings[field]) {
        draft.formToHeading[field] = value;
      }
    },
    changeFormOrder: (
      draft,
      action: PayloadAction<{ form: ShowForm; type: "up" | "down" }>,
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
  updateFormHeadingIfNotCustomized,
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

export default settingsSlice.reducer;
