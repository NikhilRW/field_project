import type { Request, Response } from "express";
import type { AuthRequest } from "../types/auth";
import { and, eq, gt, isNull } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import {
  db,
  emailVerificationTokens,
  passwordResetTokens,
  users,
  volunteerProfiles,
} from "../config/databaseSetup";
import { comparePassword, hashPassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { addMinutes, generateTokenPair, hashToken } from "../utils/tokens";
import {
  sendPasswordResetEmail,
  sendVerificationEmail as sendVerificationEmailMessage,
} from "../utils/email";
import { getColorFromName, getInitials } from "../utils/beneficiary";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

type AuthResponseUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Volunteer" | "Donor";
  isEmailVerified: boolean;
};

const googleClient = new OAuth2Client();

const getGoogleClientIds = () =>
  [
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
  ]
    .flatMap((value) => value?.split(",") ?? [])
    .map((value) => value.trim())
    .filter(Boolean);

const buildAuthResponse = (user: AuthResponseUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isAdmin: user.role === "Admin",
  isEmailVerified: user.isEmailVerified,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: "Admin" | "Volunteer" | "Donor";
    };

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    if (role === "Donor") {
      return res.status(400).json({
        success: false,
        error: "Donor registration is not available yet.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Email already in use." });
    }

    const passwordHash = await hashPassword(password);

    const [created] = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        passwordHash,
        role: role ?? "Volunteer",
        // TODO: restore email verification before production signups.
        isEmailVerified: true,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isEmailVerified: users.isEmailVerified,
      });

    if (!created) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create user." });
    }

    if (created.role === "Volunteer") {
      await db.insert(volunteerProfiles).values({
        userId: created.id,
        roleTitle: "Volunteer",
        skill: "General",
        available: true,
        initials: getInitials(created.name),
        color: getColorFromName(created.name),
      });
    }

    return res.status(201).json({
      success: true,
      data: buildAuthResponse(created),
      message: "Account created.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to register at the moment.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body as {
      email?: string;
      password?: string;
      role?: "Admin" | "Volunteer" | "Donor";
    };

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, error: "Role mismatch." });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: "Email not verified. Please verify your email.",
      });
    }

    if (!user.passwordHash) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await db
      .update(users)
      .set({ refreshTokenHash: hashToken(refreshToken) })
      .where(eq(users.id, user.id));

    return res.status(200).json({
      success: true,
      data: {
        user: buildAuthResponse(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Unable to login." });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body as { idToken?: string };

    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, error: "Google idToken is required." });
    }

    const audience = getGoogleClientIds();

    if (!audience.length) {
      return res.status(500).json({
        success: false,
        error: "Google OAuth client ID is not configured on the server.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Google token." });
    }

    if (!payload.email_verified) {
      return res
        .status(403)
        .json({ success: false, error: "Google email is not verified." });
    }

    const normalizedEmail = normalizeEmail(payload.email);
    const provider = "google";
    const googleUserId = payload.sub;
    const displayName =
      payload.name?.trim() || normalizedEmail.split("@")[0] || "Google User";

    const [oauthUser] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.oauthProvider, provider), eq(users.oauthId, googleUserId)),
      );

    const [emailUser] = oauthUser
      ? [oauthUser]
      : await db.select().from(users).where(eq(users.email, normalizedEmail));

    const user = oauthUser ?? emailUser;
    let sessionUser: AuthResponseUser;

    if (user) {
      if (
        user.oauthProvider &&
        user.oauthProvider !== provider &&
        user.oauthId &&
        user.oauthId !== googleUserId
      ) {
        return res.status(409).json({
          success: false,
          error: "This email is already linked to another sign-in provider.",
        });
      }

      const [updated] = await db
        .update(users)
        .set({
          name: user.name || displayName,
          email: normalizedEmail,
          oauthProvider: provider,
          oauthId: googleUserId,
          avatarUrl: payload.picture ?? user.avatarUrl,
          isEmailVerified: true,
        })
        .where(eq(users.id, user.id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isEmailVerified: users.isEmailVerified,
        });

      sessionUser = updated ?? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };
    } else {
      const [created] = await db
        .insert(users)
        .values({
          name: displayName,
          email: normalizedEmail,
          passwordHash: null,
          role: "Volunteer",
          isEmailVerified: true,
          oauthProvider: provider,
          oauthId: googleUserId,
          avatarUrl: payload.picture,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isEmailVerified: users.isEmailVerified,
        });

      if (!created) {
        return res
          .status(500)
          .json({ success: false, error: "Failed to create user." });
      }

      await db.insert(volunteerProfiles).values({
        userId: created.id,
        roleTitle: "Volunteer",
        skill: "General",
        available: true,
        initials: getInitials(created.name),
        color: getColorFromName(created.name),
      });

      sessionUser = created;
    }

    const tokenPayload = {
      sub: sessionUser.id,
      email: sessionUser.email,
      role: sessionUser.role,
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await db
      .update(users)
      .set({ refreshTokenHash: hashToken(refreshToken) })
      .where(eq(users.id, sessionUser.id));

    return res.status(200).json({
      success: true,
      data: {
        user: buildAuthResponse(sessionUser),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({
      success: false,
      error: "Unable to verify Google sign-in.",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, error: "Refresh token required." });
    }

    const payload = verifyRefreshToken(refreshToken);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub));

    if (!user || !user.refreshTokenHash) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid refresh token." });
    }

    const incomingHash = hashToken(refreshToken);

    if (incomingHash !== user.refreshTokenHash) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid refresh token." });
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await db
      .update(users)
      .set({ refreshTokenHash: hashToken(newRefreshToken) })
      .where(eq(users.id, user.id));

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return res
      .status(401)
      .json({ success: false, error: "Invalid refresh token." });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    await db
      .update(users)
      .set({ refreshTokenHash: null })
      .where(eq(users.id, req.user.id));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, error: "Unable to logout." });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: buildAuthResponse(user),
    });
  } catch (error) {
    console.error("Me error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to fetch user." });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const { name } = req.body as { name?: string };

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Name is required." });
    }

    const trimmed = name.trim();

    const [updated] = await db
      .update(users)
      .set({ name: trimmed })
      .where(eq(users.id, req.user.id))
      .returning();

    return res.status(200).json({
      success: true,
      data: buildAuthResponse(updated),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to update profile." });
  }
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user || user.isEmailVerified) {
      return res.status(200).json({ success: true });
    }

    const { token, tokenHash } = generateTokenPair();
    await db.insert(emailVerificationTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: addMinutes(60),
    });

    await sendVerificationEmailMessage(user.email, token);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Send verification error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to send email." });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Token is required." });
    }

    const tokenHash = hashToken(token);

    const [record] = await db
      .select()
      .from(emailVerificationTokens)
      .where(
        and(
          eq(emailVerificationTokens.tokenHash, tokenHash),
          isNull(emailVerificationTokens.usedAt),
          gt(emailVerificationTokens.expiresAt, new Date()),
        ),
      );

    if (!record) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired token." });
    }

    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, record.userId));

    await db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(emailVerificationTokens.id, record.id));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Verify email error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to verify email." });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res.status(200).json({ success: true });
    }

    const { token, tokenHash } = generateTokenPair();
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: addMinutes(30),
    });

    await sendPasswordResetEmail(user.email, token);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to send reset email." });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.body as { token?: string; email?: string };

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        error: "Token and email are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired token.",
      });
    }

    const tokenHash = hashToken(token);

    const [record] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          eq(passwordResetTokens.userId, user.id),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      );

    if (!record) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired token.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to verify reset token." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body as {
      token?: string;
      password?: string;
    };

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required.",
      });
    }

    const tokenHash = hashToken(token);

    const [record] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      );

    if (!record) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired token." });
    }

    const newPasswordHash = await hashPassword(password);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, refreshTokenHash: null })
      .where(eq(users.id, record.userId));

    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, record.id));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Unable to reset password." });
  }
};
