import type { Request, Response } from "express";
import {
  beneficiaryCategoryEnum,
  beneficiaries,
  db,
  genderEnum,
  healthStatusEnum,
} from "../config/databaseSetup";
import { getColorFromName, getInitials } from "../utils/beneficiary";

export const getBeneficiaries = async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(beneficiaries);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch beneficiaries:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch beneficiaries" });
  }
};

export const createBeneficiary = async (req: Request, res: Response) => {
  try {
    const { name, age, category, healthStatus, address, gender } = req.body as {
      name?: string;
      age?: number | string;
      category?: string;
      healthStatus?: string;
      address?: string;
      gender?: string;
    };

    if (!name || !category || !healthStatus || !address) {
      return res.status(400).json({
        success: false,
        error: "Name, category, health status, and address are required.",
      });
    }

    const parsedAge = typeof age === "string" ? Number(age) : age;

    if (!parsedAge || Number.isNaN(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid age.",
      });
    }

    const categoryValues = beneficiaryCategoryEnum.enumValues;
    const healthValues = healthStatusEnum.enumValues;
    const genderValues = genderEnum.enumValues;
    const genderValue = gender ?? "Other";

    if (!categoryValues.includes(category as any)) {
      return res.status(400).json({
        success: false,
        error: "Invalid beneficiary category.",
      });
    }

    if (!healthValues.includes(healthStatus as any)) {
      return res.status(400).json({
        success: false,
        error: "Invalid health status.",
      });
    }

    if (!genderValues.includes(genderValue as any)) {
      return res.status(400).json({
        success: false,
        error: "Invalid gender value.",
      });
    }

    const initials = getInitials(name);
    const color = getColorFromName(name);

    const [created] = await db
      .insert(beneficiaries)
      .values({
        name,
        age: parsedAge,
        gender: genderValue as any,
        category: category as any,
        healthStatus: healthStatus as any,
        address,
        initials,
        color,
      })
      .returning();

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Failed to create beneficiary:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create beneficiary" });
  }
};
