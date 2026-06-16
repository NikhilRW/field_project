import React from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/shared/stores/authStore";

export default function IndexScreen() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isHydrated) {
    return null;
  }

  return (
    <Redirect
      href={isAuthenticated ? "/(tabs)/activities" : "/(main)/onboarding"}
    />
  );
}
