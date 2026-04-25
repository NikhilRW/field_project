import { createHash, randomBytes } from "crypto";

export const generateRawToken = (size = 32) =>
  randomBytes(size).toString("hex");

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const generateTokenPair = (size = 32) => {
  const token = generateRawToken(size);
  return { token, tokenHash: hashToken(token) };
};

export const addMinutes = (minutes: number) =>
  new Date(Date.now() + minutes * 60 * 1000);

export const addDays = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);
