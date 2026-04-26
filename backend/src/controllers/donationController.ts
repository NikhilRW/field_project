import axios from "axios";
import crypto from "crypto";
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

const razorpayApiBaseUrl = "https://api.razorpay.com/v1";
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const ensureRazorpayConfig = () => {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay API keys are not configured.");
  }
};

const buildRazorpayHeaders = () => {
  ensureRazorpayConfig();

  return {
    Authorization: `Basic ${Buffer.from(
      `${razorpayKeyId}:${razorpayKeySecret}`,
    ).toString("base64")}`,
  };
};

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

const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  ensureRazorpayConfig();

  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};

const createRazorpayOrder = async (amount: number, receipt: string, notes: Record<string, string>) => {
  const response = await axios.post(
    `${razorpayApiBaseUrl}/orders`,
    {
      amount,
      currency: "INR",
      receipt,
      notes,
    },
    {
      headers: {
        "content-type": "application/json",
        ...buildRazorpayHeaders(),
      },
    },
  );

  return response.data as {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
};

const fetchRazorpayPayment = async (paymentId: string) => {
  const response = await axios.get(`${razorpayApiBaseUrl}/payments/${paymentId}`, {
    headers: buildRazorpayHeaders(),
  });

  return response.data as {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    captured: boolean;
  };
};

const captureRazorpayPayment = async (
  paymentId: string,
  amount: number,
  currency: string,
) => {
  const response = await axios.post(
    `${razorpayApiBaseUrl}/payments/${paymentId}/capture`,
    {
      amount,
      currency,
    },
    {
      headers: {
        "content-type": "application/json",
        ...buildRazorpayHeaders(),
      },
    },
  );

  return response.data as {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    captured: boolean;
  };
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
    return res.status(500).json({
      success: false,
      error: "Failed to fetch monthly donations",
    });
  }
};

export const getPendingItemDonations = async (_req: AuthRequest, res: Response) => {
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
      error: "Failed to fetch pending item donations.",
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
    const { category, purpose } = req.body as {
      category?: string;
      purpose?: string;
    };
    const imageUrl = req.cloudinaryUrl;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

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

    const donorName = await fetchDonorName(userId);

    const [createdDonation] = await db
      .insert(donations)
      .values({
        donorId: userId,
        donorName,
        purpose: purpose.trim(),
        amount: "0",
        type: "incoming",
        category: category as any,
        verificationStatus: "unverified",
        paymentStatus: "not_applicable",
        imageUrl,
        date: new Date(),
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

export const createMoneyDonationOrder = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { amount, purpose } = req.body as {
      amount?: number;
      purpose?: string;
    };

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid donation amount.",
      });
    }

    const amountInPaise = Math.round(normalizedAmount * 100);
    const donorName = await fetchDonorName(userId);
    const receipt = `don_${Date.now()}_${userId.slice(0, 8)}`;

    const razorpayOrder = await createRazorpayOrder(amountInPaise, receipt, {
      donorId: userId,
      donorName,
      purpose: purpose?.trim() || "Helping Hands Donation",
    });

    const [createdDonation] = await db
      .insert(donations)
      .values({
        donorId: userId,
        donorName,
        purpose: purpose?.trim() || "Helping Hands Donation",
        amount: normalizedAmount.toFixed(2),
        type: "incoming",
        category: "money",
        verificationStatus: "unverified",
        paymentStatus: "pending",
        razorpayOrderId: razorpayOrder.id,
        date: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      data: {
        donationId: createdDonation.id,
        keyId: razorpayKeyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        purpose: createdDonation.purpose,
        donorName,
        donation: mapDonationRow(createdDonation),
      },
    });
  } catch (error: any) {
    console.error("Failed to create Razorpay order", error?.response?.data ?? error);
    return res.status(500).json({
      success: false,
      error: error?.response?.data?.error?.description ?? "Failed to start donation payment.",
    });
  }
};

export const verifyMoneyDonation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body as {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
      };

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: "Missing Razorpay payment details.",
      });
    }

    const [donation] = await db
      .select()
      .from(donations)
      .where(
        and(
          eq(donations.donorId, userId),
          eq(donations.razorpayOrderId, razorpayOrderId),
        ),
      );

    if (!donation) {
      return res
        .status(404)
        .json({ success: false, error: "Donation order not found." });
    }

    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      await db
        .update(donations)
        .set({
          paymentStatus: "failed",
          razorpayPaymentId,
          razorpaySignature,
        })
        .where(eq(donations.id, donation.id));

      return res.status(400).json({
        success: false,
        error: "Payment signature verification failed.",
      });
    }

    const fetchedPayment = await fetchRazorpayPayment(razorpayPaymentId);

    if (fetchedPayment.order_id !== razorpayOrderId) {
      return res.status(400).json({
        success: false,
        error: "Payment does not belong to this order.",
      });
    }

    let finalPayment = fetchedPayment;
    if (fetchedPayment.status === "authorized" && !fetchedPayment.captured) {
      try {
        finalPayment = await captureRazorpayPayment(
          razorpayPaymentId,
          Math.round(Number(donation.amount) * 100),
          fetchedPayment.currency,
        );
      } catch (captureError: any) {
        console.error(
          "Failed to capture Razorpay payment, rechecking status",
          captureError?.response?.data ?? captureError,
        );
        finalPayment = await fetchRazorpayPayment(razorpayPaymentId);
      }
    }

    if (finalPayment.status !== "captured" && !finalPayment.captured) {
      await db
        .update(donations)
        .set({
          paymentStatus: "failed",
          razorpayPaymentId,
          razorpaySignature,
        })
        .where(eq(donations.id, donation.id));

      return res.status(400).json({
        success: false,
        error: "Payment was not captured successfully.",
      });
    }

    const [updatedDonation] = await db
      .update(donations)
      .set({
        paymentStatus: "paid",
        verificationStatus: "verified",
        razorpayPaymentId,
        razorpaySignature,
        paymentVerifiedAt: new Date(),
        date: new Date(),
      })
      .where(eq(donations.id, donation.id))
      .returning();

    return res.status(200).json({
      success: true,
      data: mapDonationRow(updatedDonation),
    });
  } catch (error: any) {
    console.error(
      "Failed to verify money donation",
      error?.response?.data ?? error,
    );
    return res.status(500).json({
      success: false,
      error:
        error?.response?.data?.error?.description ??
        "Failed to verify donation payment.",
    });
  }
};

export const markMoneyDonationFailed = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { razorpayOrderId } = req.body as { razorpayOrderId?: string };

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    if (!razorpayOrderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required.",
      });
    }

    await db
      .update(donations)
      .set({
        paymentStatus: "failed",
      })
      .where(
        and(
          eq(donations.donorId, userId),
          eq(donations.razorpayOrderId, razorpayOrderId),
        ),
      );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to mark donation payment as failed", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update donation payment status.",
    });
  }
};
