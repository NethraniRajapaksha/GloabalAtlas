// utils/session.js

/**
 * Safe JSON parse helper
 */
const safeParse = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safe localStorage setter
 */
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Optionally log error
  }
};

/**
 * User Session Management
 */
const USER_KEY = "user";

export const saveUserSession = (user) => {
  safeSet(USER_KEY, user);
};

export const getUserSession = () => {
  return safeParse(USER_KEY, null);
};

export const clearUserSession = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Favorites Management
 */
const FAVORITES_KEY = "favorites";

export const getFavoriteCountries = () => {
  return safeParse(FAVORITES_KEY, []);
};

export const addFavoriteCountry = (code) => {
  const favs = getFavoriteCountries();
  if (!favs.includes(code)) {
    favs.push(code);
    safeSet(FAVORITES_KEY, favs);
  }
};

export const removeFavoriteCountry = (code) => {
  const favs = getFavoriteCountries().filter(fav => fav !== code);
  safeSet(FAVORITES_KEY, favs);
};

export const isFavoriteCountry = (code) => {
  return getFavoriteCountries().includes(code);
};

/**
 * App Settings Management
 */
const SETTINGS_KEY = "app_settings";

export const saveAppSettings = (settings) => {
  safeSet(SETTINGS_KEY, settings);
};

export const getAppSettings = () => {
  return safeParse(SETTINGS_KEY, {
    theme: 'light',
    language: 'en',
  });
};

/**
 * Helper to clear all user-related data
 */
export const clearAllUserData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(FAVORITES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};
