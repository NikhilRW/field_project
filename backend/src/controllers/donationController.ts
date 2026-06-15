import type { Response } from "express";
import { and, desc, eq, ne, or, sql } from "drizzle-orm";
import {
  db,
  donationCategoryEnum,
  donations,
  users,
} from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";
import { formatDate } from "../utils/date";

const fetchDonorName = async (userId: string) => {
  const [user] = await db
    .select({
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, userId));

  return user?.name ?? "Helping Hands Supporter";
};

const mapDonationRow = (row: typeof donations.$inferSelect) => ({
  id: row.id,
  donor: row.donorName,
  donorId: row.donorId,
  purpose: row.purpose,
  amount: Number(row.amount),
  type: row.type,
  date: formatDate(row.date),
  category: row.category,
  verificationStatus: row.verificationStatus,
  paymentStatus: row.paymentStatus,
  imageUrl: row.imageUrl,
});

const getMonthLabel = (date: Date) =>
  date.toLocaleString("en-US", { month: "short" });

const buildMonthlyDonationRows = (rows: Array<typeof donations.$inferSelect>) => {
  const now = new Date();
  const monthMap = new Map<string, { month: string; received: number; spent: number }>();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthMap.set(key, {
      month: getMonthLabel(date),
      received: 0,
      spent: 0,
    });
  }

  rows.forEach((row) => {
    const key = `${row.date.getFullYear()}-${row.date.getMonth()}`;
    const month = monthMap.get(key);

    if (!month) {
      return;
    }

    if (row.type === "incoming") {
      month.received += Number(row.amount);
      return;
    }

    month.spent += Number(row.amount);
  });

  return Array.from(monthMap.values());
};

export const getDonations = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(donations)
      .where(
        and(
          eq(donations.category, "money"),
          or(
            eq(donations.type, "outgoing"),
            eq(donations.verificationStatus, "verified"),
          ),
        ),
      )
      .orderBy(desc(donations.date));

    const data = rows.map((row) => ({
      id: row.id,
      donor: row.donorName,
      purpose: row.purpose,
      amount: Number(row.amount),
      type: row.type,
      date: formatDate(row.date),
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch donations", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch donations" });
  }
};

export const getAllDonations = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(donations)
      .where(
        or(
          and(
            eq(donations.category, "money"),
            or(
              eq(donations.type, "outgoing"),
              eq(donations.verificationStatus, "verified"),
            ),
          ),
          and(
            ne(donations.category, "money"),
            eq(donations.verificationStatus, "verified"),
          ),
        ),
      )
      .orderBy(desc(donations.date));

    return res.status(200).json({
      success: true,
      data: rows.map(mapDonationRow),
    });
  } catch (error) {
    console.error("Failed to fetch all donations", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch donations" });
  }
};

export const getMonthlyDonations = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(donations)
      .where(
        and(
          eq(donations.category, "money"),
          or(
            eq(donations.type, "outgoing"),
            eq(donations.verificationStatus, "verified"),
          ),
        ),
      )
      .orderBy(desc(donations.date));

    const data = buildMonthlyDonationRows(rows);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch monthly donations", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch monthly donations" });
  }
};

export const getPendingItemDonations = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const rows = await db
      .select()
      .from(donations)
      .where(
        and(
          ne(donations.category, "money"),
          eq(donations.verificationStatus, "unverified"),
        ),
      )
      .orderBy(desc(donations.createdAt));

    return res.status(200).json({
      success: true,
      data: rows.map(mapDonationRow),
    });
  } catch (error) {
    console.error("Failed to fetch pending item donations", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch pending donations.",
    });
  }
};

export const getDonatedItemDonations = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const rows = await db
      .select()
      .from(donations)
      .where(
        and(
          ne(donations.category, "money"),
          eq(donations.verificationStatus, "verified"),
        ),
      )
      .orderBy(desc(donations.date));

    return res.status(200).json({
      success: true,
      data: rows.map(mapDonationRow),
    });
  } catch (error) {
    console.error("Failed to fetch donated item donations", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch donated items.",
    });
  }
};

export const getItemDonation = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const [donation] = await db
      .select()
      .from(donations)
      .where(and(eq(donations.id, id), ne(donations.category, "money")));

    if (!donation) {
      return res
        .status(404)
        .json({ success: false, error: "Item donation not found." });
    }

    if (
      req.user?.role !== "Admin" &&
      donation.verificationStatus !== "verified"
    ) {
      return res
        .status(404)
        .json({ success: false, error: "Item donation not found." });
    }

    return res.status(200).json({
      success: true,
      data: mapDonationRow(donation),
    });
  } catch (error) {
    console.error("Failed to fetch item donation", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch item donation.",
    });
  }
};

const updateItemDonationStatus = async (
  req: AuthRequest,
  res: Response,
  status: "verified" | "rejected",
) => {
  try {
    const id = String(req.params.id);

    const [donation] = await db
      .select()
      .from(donations)
      .where(and(eq(donations.id, id), ne(donations.category, "money")));

    if (!donation) {
      return res
        .status(404)
        .json({ success: false, error: "Item donation not found." });
    }

    if (donation.verificationStatus !== "unverified") {
      return res.status(400).json({
        success: false,
        error: "This item donation has already been reviewed.",
      });
    }

    const [updatedDonation] = await db
      .update(donations)
      .set({
        verificationStatus: status,
        date: new Date(),
      })
      .where(eq(donations.id, donation.id))
      .returning();

    return res.status(200).json({
      success: true,
      data: mapDonationRow(updatedDonation),
    });
  } catch (error) {
    console.error(`Failed to mark item donation as ${status}`, error);
    return res.status(500).json({
      success: false,
      error: `Failed to mark item donation as ${status}.`,
    });
  }
};

export const verifyItemDonation = async (req: AuthRequest, res: Response) => {
  return updateItemDonationStatus(req, res, "verified");
};

export const rejectItemDonation = async (req: AuthRequest, res: Response) => {
  return updateItemDonationStatus(req, res, "rejected");
};

export const getMyDonations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const page = Math.max(
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
      1,
    );
    const limit = Math.min(
      Math.max(Number.parseInt(String(req.query.limit ?? "7"), 10) || 7, 1),
      50,
    );
    const offset = (page - 1) * limit;

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(donations)
      .where(eq(donations.donorId, userId));

    const rows = await db
      .select()
      .from(donations)
      .where(eq(donations.donorId, userId))
      .orderBy(desc(donations.createdAt))
      .limit(limit)
      .offset(offset);

    const total = Number(totalRow?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        items: rows.map(mapDonationRow),
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch donor donations", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch your donations." });
  }
};

export const createItemDonation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { category, purpose, donorId: adminDonorId } = req.body as {
      category?: string;
      purpose?: string;
      donorId?: string;
    };
    const imageUrl = req.cloudinaryUrl;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const effectiveDonorId =
      req.user?.role === "Admin" && adminDonorId ? adminDonorId : userId;

    if (!category || !purpose || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Category, purpose, and image are required.",
      });
    }

    if (
      !donationCategoryEnum.enumValues.includes(category as any) ||
      category === "money"
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid item donation category.",
      });
    }

    const donorName = await fetchDonorName(effectiveDonorId);
    const isAdminDirect =
      req.user?.role === "Admin" && adminDonorId;

    const [createdDonation] = await db
      .insert(donations)
      .values({
        donorId: effectiveDonorId,
        donorName,
        purpose: purpose.trim(),
        amount: "0",
        type: "incoming",
        category: category as any,
        verificationStatus: isAdminDirect ? "verified" : "unverified",
        paymentStatus: "not_applicable",
        imageUrl,
        date: isAdminDirect ? new Date() : undefined,
      })
      .returning();

    return res.status(201).json({
      success: true,
      data: mapDonationRow(createdDonation),
    });
  } catch (error) {
    console.error("Failed to create item donation", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to submit item donation." });
  }
};

export const createMoneyDonation = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { amount, purpose, donorId: adminDonorId } = req.body as {
      amount?: number;
      purpose?: string;
      donorId?: string;
    };

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const effectiveDonorId =
      req.user?.role === "Admin" && adminDonorId ? adminDonorId : userId;

    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid donation amount.",
      });
    }

    const donorName = await fetchDonorName(effectiveDonorId);

    const [createdDonation] = await db
      .insert(donations)
      .values({
        donorId: effectiveDonorId,
        donorName,
        purpose: purpose?.trim() || "Helping Hands Donation",
        amount: normalizedAmount.toFixed(2),
        type: "incoming",
        category: "money",
        verificationStatus: "verified",
        paymentStatus: "paid",
        paymentVerifiedAt: new Date(),
        date: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      data: mapDonationRow(createdDonation),
    });
  } catch (error) {
    console.error("Failed to create money donation", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create donation.",
    });
  }
};
