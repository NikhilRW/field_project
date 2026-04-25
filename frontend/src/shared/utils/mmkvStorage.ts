import { createMMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

const storage = createMMKV({ id: "smart-ngo-storage" });

export const mmkvWrapper = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

export const mmkvStorage = createJSONStorage(() => mmkvWrapper);

export const mmkvAsyncStorage = {
  getItem: async (key: string) => mmkvWrapper.getItem(key),
  setItem: async (key: string, value: string) =>
    mmkvWrapper.setItem(key, value),
  removeItem: async (key: string) => mmkvWrapper.removeItem(key),
};
