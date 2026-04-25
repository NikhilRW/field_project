import { useEffect, useRef } from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import http from "@/shared/utils/http";
import { useAuthStore } from "@/shared/stores/authStore";
import { getAccessToken } from "@/shared/utils/secureStore";
import { setNotificationChannelAsync } from "expo-notifications";

const ensureNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  // Create Android notification channel for FCM
  await setNotificationChannelAsync("activity-updates", {
    name: "Activity Updates",
    importance: 5, // Max importance for heads-up notifications
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
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
      try {
        await ensureNotificationChannel();

        // Request notification permission (required for FCM on Android 13+)
        const permission = await messaging().requestPermission();

        // Permission levels: 0=disabled, 1=provisional, 2=denied, 3=allowed
        if (permission !== 1 && permission !== 3) {
          return;
        }

        // Get FCM token
        const token = await messaging().getToken();
        if (!token) {
          return;
        }

        await registerToken(token);
      } catch (error: any) {
        if (__DEV__) {
          console.warn(
            "[FCM Registration] Error during FCM setup",
            error?.message ?? error,
          );
        }
      }
    };

    const handleRegistrationError = (error: any) => {
      if (__DEV__) {
        console.warn(
          "[FCM Registration] Unable to register FCM token",
          error?.message ?? error,
        );
      }
    };

    // Listen for FCM token refreshes
    const tokenSubscription = messaging().onTokenRefresh((token) => {
      void registerToken(token).catch(handleRegistrationError);
    });

    if (lastRegisteredUserId.current !== userId) {
      void register().catch(handleRegistrationError);
    } else {
      void ensureNotificationChannel().catch(() => {});
    }

    return () => {
      isActive = false;
      tokenSubscription();
    };
  }, [isHydrated, isAuthenticated, userId]);
};
