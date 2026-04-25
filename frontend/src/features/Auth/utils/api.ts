import http from "@/shared/utils/http";
import type { AuthRole, AuthUser } from "@/shared/stores/authStore";

type AuthPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  role?: AuthRole;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: AuthRole;
};

export const loginRequest = async (payload: LoginRequest) => {
  const response = await http.post<{ success: boolean; data: AuthPayload }>(
    "/api/auth/login",
    payload,
  );
  return response.data.data;
};

export const registerRequest = async (payload: RegisterRequest) => {
  const response = await http.post<{
    success: boolean;
    data: AuthUser;
    message?: string;
  }>("/api/auth/register", payload);
  return response.data.data;
};

export const sendVerificationEmailRequest = async (email: string) => {
  const response = await http.post<{ success: boolean }>(
    "/api/auth/send-verification-email",
    { email },
  );
  return response.data;
};

export const verifyEmailRequest = async (token: string) => {
  const response = await http.post<{ success: boolean }>(
    "/api/auth/verify-email",
    { token },
  );
  return response.data;
};

export const forgotPasswordRequest = async (email: string) => {
  const response = await http.post<{ success: boolean }>(
    "/api/auth/forgot-password",
    { email },
  );
  return response.data;
};

export const resetPasswordRequest = async (payload: {
  token: string;
  password: string;
}) => {
  const response = await http.post<{ success: boolean }>(
    "/api/auth/reset-password",
    payload,
  );
  return response.data;
};

export const fetchMe = async () => {
  const response = await http.get<{ success: boolean; data: AuthUser }>(
    "/api/auth/me",
  );
  return response.data.data;
};

export const logoutRequest = async () => {
  const response = await http.post<{ success: boolean }>("/api/auth/logout");
  return response.data;
};
