import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  forgotPasswordRequest,
  googleLoginRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  resetPasswordRequest,
  sendVerificationEmailRequest,
  updateProfileRequest,
  verifyEmailRequest,
} from "../utils/api";
import { useRouter } from "expo-router";

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      await login({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: registerRequest,
  });

export const useGoogleLoginMutation = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: googleLoginRequest,
    onSuccess: async (data) => {
      await login({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
};

export const useSendVerificationEmailMutation = () =>
  useMutation({
    mutationFn: sendVerificationEmailRequest,
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: verifyEmailRequest,
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: forgotPasswordRequest,
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: resetPasswordRequest,
  });

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await logout();
      queryClient.clear();
      router.replace("/(auth)/login");
    },
    onError: async (error) => {
      // TODO: handle that apiClient null error.
      console.log(error);
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: async (updatedUser) => {
      setUser({ ...user!, ...updatedUser });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users", "all"] }),
        queryClient.invalidateQueries({ queryKey: ["users", "manage"] }),
      ]);
    },
  });
};
