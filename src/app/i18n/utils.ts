export const isBrowser = typeof window !== "undefined";

export function getBrowserLanguage(): "zh" | "en" {
  if (!isBrowser) return "zh";

  try {
    // 尝试从localStorage获取
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      return savedLanguage;
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

export function setLocalStorageItem(key: string, value: string): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set localStorage item: ${key}`, error);
  }
}
