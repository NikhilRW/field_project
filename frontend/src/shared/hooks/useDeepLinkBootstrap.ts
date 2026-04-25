import { useEffect, useRef } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import http from "@/shared/utils/http";
import { verifyEmailRequest } from "@/features/Auth/utils/api";

const allowedSchemes = new Set(["helpinghands", "exp+helpinghands"]);
const allowedHosts = new Set(["helpinghands.com"]);

const isAllowedDeepLink = (url: string) => {
  const parsed = Linking.parse(url);
  if (!parsed.scheme) {
    return false;
  }

  if (parsed.scheme === "https") {
    return parsed.hostname ? allowedHosts.has(parsed.hostname) : false;
  }

  return allowedSchemes.has(parsed.scheme);
};

const buildResetRoute = (token: string, email: string) =>
  `/(auth)/reset-password?token=${encodeURIComponent(
    token,
  )}&email=${encodeURIComponent(email)}`;

export const useDeepLinkBootstrap = () => {
  const isHandling = useRef(false);

  const handleVerifyEmail = async (token: string, email: string) => {
    try {
      await verifyEmailRequest(token);
      showMessage({
        message: "Email verified",
        description: `Verified ${email}. You can sign in now.`,
        type: "success",
        duration: 3000,
      });
      router.replace("/(auth)/login");
    } catch (error: any) {
      showMessage({
        message: "Verification failed",
        description:
          error?.message ?? "Unable to verify email. Please try again.",
        type: "danger",
        duration: 3500,
      });
      router.replace("/(auth)/login");
    }
  };

  const handleResetPassword = async (token: string, email: string) => {
    try {
      await http.post("/api/auth/verify-reset-token", { token, email });
      showMessage({
        message: "Reset link verified",
        description: "Please set a new password.",
        type: "success",
        duration: 3000,
      });
      router.replace(buildResetRoute(token, email) as any);
    } catch (error: any) {
      showMessage({
        message: "Reset link invalid",
        description: error?.message ?? "The reset link is invalid or expired.",
        type: "danger",
        duration: 3500,
      });
      router.replace("/(auth)/login");
    }
  };

  const handleDeepLink = async (url: string) => {
    if (!isAllowedDeepLink(url) || isHandling.current) {
      return;
    }

    const parsed = Linking.parse(url);
    const path = parsed.path ?? "";

    // Only handle routes we actually care about
    if (!path.includes("verify-email") && !path.includes("reset-password")) {
      return;
    }

    isHandling.current = true;
    const token = parsed.queryParams?.token;
    const email = parsed.queryParams?.email;

    if (typeof token !== "string" || typeof email !== "string") {
      showMessage({
        message: "Invalid link",
        description: "Missing token or email in the link.",
        type: "danger",
        duration: 3500,
      });
      isHandling.current = false;
      return;
    }

    if (path.includes("verify-email")) {
      await handleVerifyEmail(token, email);
      isHandling.current = false;
      return;
    }

    if (path.includes("reset-password")) {
      await handleResetPassword(token, email);
      isHandling.current = false;
      return;
    }

    isHandling.current = false;
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (isMounted && initialUrl) {
        await handleDeepLink(initialUrl);
      }
    };

    bootstrap();

    const subscription = Linking.addEventListener("url", async ({ url }) => {
      await handleDeepLink(url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
};
