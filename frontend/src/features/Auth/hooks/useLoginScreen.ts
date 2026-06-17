import { Alert } from "react-native";
import { useLoginForm } from "../hooks/useLoginForm";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "../hooks/useAuthMutations";
import {
  getGoogleIdToken,
  getGoogleSignInErrorMessage,
} from "../utils/googleAuth";
import { isWeb } from "@/shared/constants/platform";
import { router } from "expo-router";
import { useWebGoogleLogin } from "./useGoogleLogin";
import { showAppMessage } from "@/shared/utils/flashMessage";

export const useLoginScreen = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
  } = useLoginForm();

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const googleLogin = useWebGoogleLogin({
    onLoginSuccess: async (codeResponse) => {
      await googleLoginMutation.mutateAsync({ authCode: codeResponse });
    },
    onLoginError: (errorTitle, errorDescription) => {
      showAppMessage(
        errorTitle ?? getGoogleSignInErrorMessage(errorTitle),
        errorDescription ?? getGoogleSignInErrorMessage(errorDescription),
      );
    },
  });

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password });

      const destination = "/(tabs)/activities";

      router.replace(destination);
    } catch (error: any) {
      const message = error?.message ?? "Unable to sign in. Please try again.";
      Alert.alert("Login failed", message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (isWeb) {
        googleLogin();
      } else {
        const idToken = await getGoogleIdToken();

        if (!idToken) {
          return;
        }

        await googleLoginMutation.mutateAsync({ idToken });
        router.replace("/(tabs)/activities");
      }
    } catch (error: any) {
      showAppMessage(
        "Google sign-in failed",
        getGoogleSignInErrorMessage(error),
        "danger",
      );
    }
  };

  const isAuthLoading =
    loginMutation.isPending || googleLoginMutation.isPending;

  const isGoogleLoginLoading = googleLoginMutation.isPending;

  const isEmailLoginLoading = loginMutation.isPending;

  return {
    isAuthLoading,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    handleLogin,
    handleGoogleSignIn,
    googleLoginMutation,
    isGoogleLoginLoading,
    isEmailLoginLoading,
  };
};
