import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import http from "@/shared/utils/http";
import { useAuthStore } from "@/shared/stores/authStore";
import { ACTIVITY_NOTIFICATION_CHANNEL_ID } from "@/shared/constants/notifications";
import { getAccessToken } from "@/shared/utils/secureStore";

const ensureNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    ACTIVITY_NOTIFICATION_CHANNEL_ID,
    {
      name: "Activity Updates",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#1B6CA8",
    },
  );
};

export const usePushRegistration = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const lastRegisteredUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !userId) {
      lastRegisteredUserId.current = null;
      return;
    }

    let isActive = true;

    const registerToken = async (token: string) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return false;
      }

      try {
        await http.post("/api/notifications/register-token", { token });
      } catch (error: any) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        throw error;
      }

      if (isActive) {
        lastRegisteredUserId.current = userId;
      }

      return true;
    };

    const register = async () => {
      if (!Device.isDevice) {
        return;
      }

      await ensureNotificationChannel();

      const permission = await Notifications.getPermissionsAsync();
      let status = permission.status;

      if (status !== "granted") {
        const request = await Notifications.requestPermissionsAsync();
        status = request.status;
      }

      if (status !== "granted") {
        return;
      }

      const projectId =
        Constants.easConfig?.projectId ??
        Constants.expoConfig?.extra?.eas?.projectId;

      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();

      const token = tokenResponse.data;
      if (!token) {
        return;
      }

      await registerToken(token);
    };

    const handleRegistrationError = (error: any) => {
      if (__DEV__) {
        console.warn(
          "[Push Registration] Unable to register Expo push token",
          error?.message ?? error,
        );
      }
    };

    const tokenSubscription = Notifications.addPushTokenListener((token) => {
      void registerToken(token.data).catch(handleRegistrationError);
    });

    if (lastRegisteredUserId.current !== userId) {
      void register().catch(handleRegistrationError);
    } else {
      void ensureNotificationChannel().catch(() => {});
    }

    return () => {
      isActive = false;
      tokenSubscription.remove();
    };
  }, [isHydrated, isAuthenticated, userId]);
};
