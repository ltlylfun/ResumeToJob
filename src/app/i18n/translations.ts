// filepath: c:\Users\z'j\Desktop\ResumeToJob\src\app\i18n\translations.ts
// 所有翻译已移至各个组件，这个文件仅保留必要的类型定义

export interface Translations {
  // 注意: 所有翻译内容都已移至各个组件
}

export const translations: Record<string, Translations> = {
  en: {},
  zh: {},
};

export type SupportedLanguage = keyof typeof translations;
