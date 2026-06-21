import type { Response } from "express";
import { desc, eq,} from "drizzle-orm";
import {
  db,
  donations,
  draftDonations,
  users,
} from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";
import { formatDate } from "../utils/date";

const fetchDonorName = async (userId: string) => {
  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, userId));
  return user?.name ?? "Helping Hands Supporter";
};

const mapDraftRow = (row: typeof draftDonations.$inferSelect) => ({
  id: row.id,
  donorId: row.donorId,
  category: row.category,
  purpose: row.purpose,
  imageUrl: row.imageUrl,
  createdAt: formatDate(row.createdAt),
  updatedAt: formatDate(row.updatedAt),
});

export const createDraft = async (req: AuthRequest, res: Response) => {
  try {
    const { category, purpose, donorId } = req.body;
    const imageUrl = req.cloudinaryUrl;

    if (!category || category === "money") {
      return res.status(400).json({
        success: false,
        error: "Invalid draft category.",
      });
    }

    const effectiveDonorId =
      req.user?.role === "Admin" && donorId ? donorId : req.user?.id;

    const [createdDraft] = await db
      .insert(draftDonations)
      .values({
        donorId: effectiveDonorId,
        category,
        purpose: purpose?.trim() || null,
        imageUrl: imageUrl || null,
      })
      .returning();

    return res.status(201).json({
      success: true,
      data: mapDraftRow(createdDraft),
    });
  } catch (error) {
    console.error("Failed to create draft", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create draft.",
    });
  }
};

export const getDrafts = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "Admin";
    const whereClause = isAdmin
      ? undefined
      : eq(draftDonations.donorId, req.user!.id);

    const rows = await db
      .select()
      .from(draftDonations)
      .where(whereClause)
      .orderBy(desc(draftDonations.createdAt));

    return res.status(200).json({
      success: true,
      data: rows.map(mapDraftRow),
    });
  } catch (error) {
    console.error("Failed to fetch drafts", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch drafts.",
    });
  }
};

export const getDraft = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const [draft] = await db
      .select()
      .from(draftDonations)
      .where(eq(draftDonations.id, id));

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: "Draft not found.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      draft.donorId !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapDraftRow(draft),
    });
  } catch (error) {
    console.error("Failed to fetch draft", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch draft.",
    });
  }
};

export const updateDraft = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { purpose, category } = req.body;
    const imageUrl = req.cloudinaryUrl;

    const [draft] = await db
      .select()
      .from(draftDonations)
      .where(eq(draftDonations.id, id));

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: "Draft not found.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      draft.donorId !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    const updateData: Record<string, any> = {};
    if (purpose !== undefined) updateData.purpose = purpose.trim() || null;
    if (category !== undefined && category !== "money")
      updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    updateData.updatedAt = new Date();

    const [updatedDraft] = await db
      .update(draftDonations)
      .set(updateData)
      .where(eq(draftDonations.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      data: mapDraftRow(updatedDraft),
    });
  } catch (error) {
    console.error("Failed to update draft", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update draft.",
    });
  }
};

export const deleteDraft = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const [draft] = await db
      .select()
      .from(draftDonations)
      .where(eq(draftDonations.id, id));

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: "Draft not found.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      draft.donorId !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    await db.delete(draftDonations).where(eq(draftDonations.id, id));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to delete draft", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete draft.",
    });
  }
};

export const submitDraft = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const [draft] = await db
      .select()
      .from(draftDonations)
      .where(eq(draftDonations.id, id));

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: "Draft not found.",
      });
    }

    if (
      req.user?.role !== "Admin" &&
      draft.donorId !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    if (!draft.imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Draft must have an image before submitting.",
      });
    }

    const donorName = await fetchDonorName(draft.donorId ?? req.user!.id);

    const [createdDonation] = await db
      .insert(donations)
      .values({
        donorId: draft.donorId ?? req.user!.id,
        donorName,
        purpose: draft.purpose?.trim() || "Item donation",
        amount: "0",
        type: "incoming",
        category: draft.category,
        verificationStatus:
          req.user?.role === "Admin" ? "verified" : "unverified",
        paymentStatus: "not_applicable",
        imageUrl: draft.imageUrl,
        date: new Date(),
      })
      .returning();

    await db.delete(draftDonations).where(eq(draftDonations.id, id));

    return res.status(201).json({
      success: true,
      data: {
        id: createdDonation.id,
        donor: createdDonation.donorName,
        donorId: createdDonation.donorId,
        purpose: createdDonation.purpose,
        amount: Number(createdDonation.amount),
        type: createdDonation.type,
        date: formatDate(createdDonation.date),
        category: createdDonation.category,
        verificationStatus: createdDonation.verificationStatus,
        paymentStatus: createdDonation.paymentStatus,
        imageUrl: createdDonation.imageUrl,
        isDonated: createdDonation.isDonated,
      },
    });
  } catch (error) {
    console.error("Failed to submit draft", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit draft donation.",
    });
  }
};
