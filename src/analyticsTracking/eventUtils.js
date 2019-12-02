export const normalizeEventType = str =>
  str
    .trim()
    .replace(/ /gi, '_')
    .toUpperCase();
