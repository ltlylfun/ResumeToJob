type Object = { [key: string]: any };

const isObject = (item: any): item is Object => {
  return item && typeof item === "object" && !Array.isArray(item);
};

export const deepMerge = (target: Object, source: Object, level = 0) => {
  const copyTarget = level === 0 ? structuredClone(target) : target;
  for (const key in source) {
    const sourceValue = source[key];

    if (!isObject(sourceValue)) {
      copyTarget[key] = sourceValue;
    } else {
      if (!isObject(copyTarget[key])) {
        copyTarget[key] = {};
      }
      deepMerge(copyTarget[key], sourceValue, level + 1);
    }
  }
  return copyTarget;
};
