/**
 * 深度克隆对象工具函数
 *
 * 优先使用原生的structuredClone API（如果可用），
 * 否则回退到JSON序列化方法。
 *
 * 注意事项:
 * - JSON序列化方法不支持循环引用、函数、Symbol、BigInt等
 * - structuredClone支持更多类型，但仍不支持函数
 *
 * @param value 需要克隆的值
 * @returns 深度克隆后的值
 */
export const deepClone = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  // 优先使用浏览器原生API
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch (error) {
      console.warn("structuredClone失败，回退到JSON方法", error);
    }
  }

  // 回退方案：JSON序列化（不支持循环引用和特殊类型）
  return JSON.parse(JSON.stringify(value)) as T;
};
