import { create } from "zustand";
import { mmkvWrapper } from "@/shared/utils/mmkvStorage";

interface NotificationState {
  hasHandledKilledStateNotification: boolean;
  setHasHandledKilledStateNotification: (value: boolean) => void;
  resetNotificationState: () => void;
}

const notificationHandledKey = "hasHandledKilledStateNotification";

const getInitialHandledState = () => {
  const stored = mmkvWrapper.getItem(notificationHandledKey);

  if (!stored) {
    return false;
  }

  try {
    return Boolean(JSON.parse(stored));
  } catch {
    return false;
  }
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  hasHandledKilledStateNotification: getInitialHandledState(),

  setHasHandledKilledStateNotification: (value: boolean) => {
    set({ hasHandledKilledStateNotification: value });
    mmkvWrapper.setItem(notificationHandledKey, JSON.stringify(value));
  },

  resetNotificationState: () => {
    set({ hasHandledKilledStateNotification: false });
    mmkvWrapper.removeItem(notificationHandledKey);
  },
}));

export const createNotificationStore = () => useNotificationStore.getState();
