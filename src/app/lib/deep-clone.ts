export const deepClone = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch (error) {
      console.warn("structuredClone failed, fallback to JSON", error);
    }
  }

  return JSON.parse(JSON.stringify(value)) as T;
};
