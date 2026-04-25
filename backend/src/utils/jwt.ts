import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: "Admin" | "Volunteer" | "Donor";
};

const accessSecret = process.env.JWT_SECRET ?? "dev_access_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "dev_refresh_secret";

const normalizeExpiresIn = (
  value: string | undefined,
  fallback: string,
): string | number => {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (/^\d+(ms|s|m|h|d|w|y)$/.test(trimmed)) return trimmed;
  return fallback;
};

const accessExpiresIn = normalizeExpiresIn(
  process.env.JWT_ACCESS_EXPIRES_IN,
  "15m",
);
const refreshExpiresIn = normalizeExpiresIn(
  process.env.JWT_REFRESH_EXPIRES_IN,
  "7d",
);

export const signAccessToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn as any,
  });
};

export const signRefreshToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret) as AuthTokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret) as AuthTokenPayload;
};
