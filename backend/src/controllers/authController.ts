import type { Request, Response } from "express";
import type { AuthRequest } from "../types/auth";
import { and, eq, gt, isNull } from "drizzle-orm";
import { OAuth2Client, OAuth2ClientOptions } from "google-auth-library";
import {
  db,
  emailVerificationTokens,
  passwordResetTokens,
  refreshTokens,
  users,
} from "../config/databaseSetup";
import { comparePassword, hashPassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { addMinutes, hashToken } from "../utils/tokens";
import {
  sendPasswordResetOtpEmail,
  sendVerificationOtpEmail,
} from "../utils/email";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

type AuthResponseUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  isEmailVerified: boolean;
};

const clientOptions: OAuth2ClientOptions = {
  client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: "postmessage",
};

const googleClient = new OAuth2Client(clientOptions);

const getGoogleClientIds = () =>
  [process.env.GOOGLE_OAUTH_CLIENT_ID]
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
      role?: "Admin" | "User";
    };

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
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
        role: role ?? "User",
        isEmailVerified: false,
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
      role?: "Admin" | "User";
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
        data: { email: user.email },
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Account is blocked. Contact support.",
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

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
    });

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
    const { idToken, authCode } = req.body as {
      idToken?: string;
      authCode?: string;
    };

    if (!idToken && !authCode) {
      return res.status(400).json({
        success: false,
        error: "Google idToken or authCode is required.",
      });
    }
    let payload = null;
    if (idToken) {
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

      payload = ticket.getPayload();

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
    } else {
      const { tokens } = await googleClient.getToken(authCode);
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: getGoogleClientIds(),
      });
      payload = ticket.getPayload();
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
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          error: "Account is blocked. Contact support.",
        });
      }

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
          role: "User",
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

      sessionUser = created;
    }

    const tokenPayload = {
      sub: sessionUser.id,
      email: sessionUser.email,
      role: sessionUser.role,
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await db.insert(refreshTokens).values({
      userId: sessionUser.id,
      tokenHash: hashToken(refreshToken),
    });

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

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid refresh token." });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Account is blocked. Contact support.",
      });
    }

    const incomingHash = hashToken(refreshToken);

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, incomingHash));

    if (!storedToken) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid refresh token." });
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, storedToken.id));

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
    // TODO: using token hash used proper otp field from the database
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
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, req.user.id));

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.insert(emailVerificationTokens).values({
      userId: user.id,
      tokenHash: otp,
      expiresAt: addMinutes(10),
    });

    await sendVerificationOtpEmail(user.email, otp);

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
    const { email, otp } = req.body as { email?: string; otp?: string };

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "Email and OTP are required." });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP." });
    }

    const [record] = await db
      .select()
      .from(emailVerificationTokens)
      .where(
        and(
          eq(emailVerificationTokens.userId, user.id),
          eq(emailVerificationTokens.tokenHash, otp),
          isNull(emailVerificationTokens.usedAt),
          gt(emailVerificationTokens.expiresAt, new Date()),
        ),
      );

    if (!record) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP." });
    }

    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, user.id));

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash: otp,
      expiresAt: addMinutes(10),
    });

    await sendPasswordResetOtpEmail(user.email, otp);

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
    const { email, otp, password } = req.body as {
      email?: string;
      otp?: string;
      password?: string;
    };

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        error: "Email, OTP, and new password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP." });
    }

    const [record] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          eq(passwordResetTokens.tokenHash, otp),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      );

    if (!record) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP." });
    }

    const newPasswordHash = await hashPassword(password);

    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, user.id));

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, user.id));

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
