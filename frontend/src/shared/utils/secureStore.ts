import * as SecureStore from "expo-secure-store";
import { mmkvWrapper } from "./mmkvStorage";
import { isWeb } from "../constants/platform";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export const webSafeSecureStore = {
  setItemAsync: async (key: string, value: string) => {
    if (isWeb) {
      mmkvWrapper.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItemAsync: async (key: string) => {
    if (isWeb) {
      return mmkvWrapper.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  deleteItemAsync: async (key: string) => {
    if (isWeb) {
      mmkvWrapper.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const setAccessToken = async (token: string) => {
  await webSafeSecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = async () => {
  return await webSafeSecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = async () => {
  await webSafeSecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};

export const setRefreshToken = async (token: string) => {
  await webSafeSecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async () => {
  return await webSafeSecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = async () => {
  await webSafeSecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async () => {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
};
