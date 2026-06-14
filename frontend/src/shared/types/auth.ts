export type AuthRole = "Admin" | "User";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  isEmailVerified: boolean;
};

export type AuthPayload = {
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

export type VerifyEmailPayload = {
  token: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};
