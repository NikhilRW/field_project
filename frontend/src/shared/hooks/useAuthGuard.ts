import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/shared/stores/authStore";
import { fetchMe } from "@/features/Auth/utils/api";

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isFetchingProfile = useRef(false);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || user || isFetchingProfile.current) {
      return;
    }

    isFetchingProfile.current = true;

    fetchMe()
      .then((data) => {
        setUser(data);
      })
      .catch(async () => {
        await logout();
        router.replace("/(auth)/login");
      })
      .finally(() => {
        isFetchingProfile.current = false;
      });
  }, [isHydrated, isAuthenticated, user, setUser, logout, router]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const rootSegment = segments[0];
    const isInAuthGroup = rootSegment === "(auth)";
    const isInTabsGroup = rootSegment === "(tabs)";
    const isInMainGroup = rootSegment === "(main)";
    const isIndexRoute = pathname === "/";
    const isOnboardingRoute = pathname === "/onboarding";
    const tabSegment = segments[1];

    if (!isAuthenticated) {
      if (!isInAuthGroup && !isIndexRoute && !isOnboardingRoute) {
        router.replace("/(auth)/login");
      }
      return;
    }

    const defaultRoute = "/(tabs)/dashboard";

    if (isInAuthGroup) {
      router.replace(defaultRoute);
      return;
    }

    if (!isAdmin) {
      if (isInTabsGroup) {
        const allowedTabs = new Set(["dashboard", "activities", "profile"]);
        if (tabSegment && !allowedTabs.has(tabSegment)) {
          router.replace(defaultRoute);
        }
      }

      if (isInMainGroup) {
        const isActivityDetailsRoute =
          segments[1] === "activity" && Boolean(segments[2]);

        if (!isActivityDetailsRoute) {
          router.replace(defaultRoute);
        }
      }
    }
  }, [segments, pathname, isAuthenticated, isHydrated, isAdmin, router]);
};
