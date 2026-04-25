import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  forgotPasswordRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  resetPasswordRequest,
  sendVerificationEmailRequest,
  verifyEmailRequest,
} from "../utils/api";

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

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await logout();
    },
    onError: async () => {
      await logout();
    },
  });
};
