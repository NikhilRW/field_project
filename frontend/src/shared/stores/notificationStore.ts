import { create } from "zustand";
import { mmkvStorage } from "@/shared/utils/mmkvStorage";

interface NotificationState {
  hasHandledKilledStateNotification: boolean;
  setHasHandledKilledStateNotification: (value: boolean) => void;
  resetNotificationState: () => void;
}

export const createNotificationStore = () => {
  const store = create<NotificationState>()(
    (set) => ({
      hasHandledKilledStateNotification: false,

      setHasHandledKilledStateNotification: (value: boolean) =>
        set({ hasHandledKilledStateNotification: value }),

      resetNotificationState: () =>
        set({ hasHandledKilledStateNotification: false }),
    })
  );

  return store();
};

/**
 * Simplified version for use in components
 */
export const useNotificationStore = () => {
  const store = create<NotificationState>()(
    (set) => ({
      hasHandledKilledStateNotification: false,

      setHasHandledKilledStateNotification: (value: boolean) => {
        set({ hasHandledKilledStateNotification: value });
        mmkvStorage.set("hasHandledKilledStateNotification", JSON.stringify(value));
      },

      resetNotificationState: () => {
        set({ hasHandledKilledStateNotification: false });
        mmkvStorage.delete("hasHandledKilledStateNotification");
      },
    })
  );

  // Initialize from storage
  const stored = mmkvStorage.getString("hasHandledKilledStateNotification");
  if (stored) {
    store.setState({ hasHandledKilledStateNotification: JSON.parse(stored) });
  }

  return store();
};
