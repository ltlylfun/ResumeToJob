export const generateRandomString = (length: number = 9): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

export const generateUniqueId = (
  prefix: string = "",
  randomLength: number = 9,
): string => {
  const timestamp = Date.now().toString();
  const randomPart = generateRandomString(randomLength);

  if (prefix) {
    return `${prefix}-${timestamp}-${randomPart}`;
  }

  return `${timestamp}${randomPart}`;
};
