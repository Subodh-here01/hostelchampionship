const globalCache = {};

export const getCache = (key) => globalCache[key];

export const setCache = (key, value) => {
  globalCache[key] = value;
};
