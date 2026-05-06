export const generateRandomId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const capitalizeStr = (str: string): string => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
