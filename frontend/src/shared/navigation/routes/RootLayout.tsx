import {
  clientPersister,
  queryClient,
  resumePausedMutationsIfOnline,
} from "@/shared/config/tanstack";
import { useAuthGuard } from "@/shared/hooks/useAuthGuard";
import { useDeepLinkBootstrap } from "@/shared/hooks/useDeepLinkBootstrap";
import { useNotificationBootstrap } from "@/shared/hooks/useNotificationBootstrap";
import { useNotificationObserver } from "@/shared/hooks/useNotificationObserver";
import { usePushRegistration } from "@/shared/hooks/usePushRegistration";
import { useAuthStore } from "@/shared/stores/authStore";
import { setupFCM } from "@/shared/utils/fcm";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "@/shared/config/firebase";
import { useLoadSkia } from "@/shared/hooks/useLoadSkia";
import { isWeb } from "@/shared/constants/platform";
import { GoogleOAuthProvider } from "@react-oauth/google";

SplashScreen.preventAutoHideAsync();

// TODO: modularize the styles here also
function RootLayoutNav() {
  const { isSkiaLoded } = useLoadSkia();

  if (!isSkiaLoded) {
    return null; // or a loading indicator
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)/forgot-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/reset-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(main)/add-beneficiary"
        options={{
          headerShown: true,
          title: "Add Beneficiary",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#1B6CA8",
          headerTitleStyle: { fontWeight: "600" as const, color: "#1C1C2E" },
        }}
      />
      <Stack.Screen
        name="(main)/add-activity"
        options={{
          headerShown: true,
          title: "Add Activity",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#1B6CA8",
          headerTitleStyle: { fontWeight: "600" as const, color: "#1C1C2E" },
        }}
      />
      <Stack.Screen
        name="(main)/activity/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/verify-items"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/verify-item/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/donatedItems"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/donatedItem/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/donation/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/donate"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(main)/manage-users"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const [hasRootLayoutMounted, setHasRootLayoutMounted] = useState(false);

  useAuthGuard();
  useDeepLinkBootstrap();
  useNotificationObserver();
  usePushRegistration();
  useNotificationBootstrap();

  // Initialize FCM when user logs in
  useEffect(() => {
    if (isAuthenticated && isHydrated) {
      setupFCM().catch((error) => {
        console.error("Failed to setup FCM:", error);
      });
    }
  }, [isAuthenticated, isHydrated]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const canHideSplash = isHydrated && hasRootLayoutMounted && pathname !== "/";

  useEffect(() => {
    if (canHideSplash) {
      SplashScreen.hideAsync();
    }
  }, [canHideSplash]);

  const onLayoutRootView = useCallback(() => {
    setHasRootLayoutMounted(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      onSuccess={resumePausedMutationsIfOnline}
      persistOptions={{
        persister: clientPersister,
        maxAge: Infinity, // Keep mutations indefinitely for offline-first
        dehydrateOptions: {
          // Persist mutations that are queued/in-flight (paused = queued while offline)
          shouldDehydrateMutation: (mutation: any) => {
            return (
              mutation.state.status === "pending" ||
              mutation.state.status === "paused"
            );
          },
        },
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        {isWeb ? (
          <GoogleOAuthProvider
            clientId={process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!}
          >
            <RootLayoutNav />
          </GoogleOAuthProvider>
        ) : (
          <RootLayoutNav />
        )}
        <FlashMessage position="bottom" style={{ marginBottom: bottom }} />
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
