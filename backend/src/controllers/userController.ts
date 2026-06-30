import type { Response } from "express";
import { eq } from "drizzle-orm";
import { db, users } from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";
import { hashPassword } from "../utils/password";

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isBlocked: users.isBlocked,
      })
      .from(users)
      .orderBy(users.createdAt);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch users." });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      role?: string;
    };

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required.",
      });
    }

    const userRole = role === "Admin" ? "Admin" : "User";

    if (userRole === "Admin") {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required for admin accounts.",
        });
      }

      const normalizedEmail = email.toLowerCase().trim();

      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, normalizedEmail));

      if (existing) {
        return res.status(409).json({
          success: false,
          error: "A user with this email already exists.",
        });
      }

      const passwordHash = await hashPassword(password);

      const [createdUser] = await db
        .insert(users)
        .values({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: userRole,
          isEmailVerified: true,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isBlocked: users.isBlocked,
        });

      return res.status(201).json({ success: true, data: createdUser });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required.",
      });
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: "Phone number must have at least 10 digits.",
      });
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phone, cleanedPhone));

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "A user with this phone number already exists.",
      });
    }

    const autoPassword =
      name.trim().toLowerCase().slice(0, 4) + cleanedPhone.slice(-4);
    const passwordHash = await hashPassword(autoPassword);

    const [createdUser] = await db
      .insert(users)
      .values({
        name: name.trim(),
        phone: cleanedPhone,
        passwordHash,
        role: userRole,
        isEmailVerified: true,
      })
      .returning({
        id: users.id,
        name: users.name,
        phone: users.phone,
        role: users.role,
        isBlocked: users.isBlocked,
      });

    return res.status(201).json({ success: true, data: createdUser });
  } catch (error) {
    console.error("Failed to create user", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create user." });
  }
};

export const toggleBlockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required.",
      });
    }

    const [user] = await db
      .select({ id: users.id, isBlocked: users.isBlocked })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ isBlocked: !user.isBlocked })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isBlocked: users.isBlocked,
      });

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Failed to toggle user block status", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update user." });
  }
};
