import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useAuthStore } from "@/shared/stores/authStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const getActivityIdFromNotification = (
  notification: Notifications.Notification,
) => {
  const activityId = notification.request.content.data?.activityId;
  return typeof activityId === "string" && activityId.length > 0
    ? activityId
    : null;
};

export const useNotificationObserver = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const pendingActivityIdRef = useRef<string | null>(null);
  const handledResponseIdsRef = useRef(new Set<string>());

  useEffect(() => {
    let isMounted = true;

    const stashResponse = (response: Notifications.NotificationResponse) => {
      const identifier = response.notification.request.identifier;

      if (handledResponseIdsRef.current.has(identifier)) {
        return;
      }

      handledResponseIdsRef.current.add(identifier);
      pendingActivityIdRef.current = getActivityIdFromNotification(
        response.notification,
      );
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response) {
        return;
      }

      stashResponse(response);
    });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        stashResponse(response);
      });

    return () => {
      isMounted = false;
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !pendingActivityIdRef.current) {
      return;
    }

    const activityId = pendingActivityIdRef.current;
    pendingActivityIdRef.current = null;
    router.push(`/(main)/activity/${activityId}` as any);
  }, [isAuthenticated, isHydrated]);
};
