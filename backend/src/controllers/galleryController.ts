import type { Response } from "express";
import { desc, eq } from "drizzle-orm";
import type { AuthRequest } from "../types/auth";
import { db, galleryImages } from "../config/databaseSetup";
import { deleteImageFromS3 } from "../utils/s3Upload";

export const getGalleryImages = async (req: AuthRequest, res: Response) => {
  try {
    console.log("[GalleryController] Fetching gallery images...");
    const rows = await db
      .select({
        id: galleryImages.id,
        imageUrl: galleryImages.imageUrl,
        caption: galleryImages.caption,
        altText: galleryImages.altText,
        createdAt: galleryImages.createdAt,
      })
      .from(galleryImages)
      .orderBy(desc(galleryImages.createdAt));

    console.log("[GalleryController] Found", rows.length, "images");
    if (rows.length > 0) {
      console.log("[GalleryController] First image URL:", rows[0].imageUrl);
    }

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[GalleryController] Failed to fetch gallery images", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch gallery images" });
  }
};

export const addGalleryImages = async (req: AuthRequest, res: Response) => {
  try {
    const urls = req.s3Urls;

    if (!urls || urls.length === 0) {
      console.error("[GalleryController] No s3Urls found on request");
      return res
        .status(400)
        .json({ success: false, error: "No images provided." });
    }

    console.log("[GalleryController] Uploading", urls.length, "images to DB");
    console.log("[GalleryController] URLs:", urls);

    const caption = req.body.caption as string | undefined;
    const altText = req.body.altText as string | undefined;

    const values = urls.map((url) => ({
      imageUrl: url,
      caption: caption ?? null,
      altText: altText ?? null,
    }));

    const created = await db
      .insert(galleryImages)
      .values(values)
      .returning({
        id: galleryImages.id,
        imageUrl: galleryImages.imageUrl,
        caption: galleryImages.caption,
        altText: galleryImages.altText,
        createdAt: galleryImages.createdAt,
      });

    console.log("[GalleryController] Inserted", created.length, "images successfully");

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("[GalleryController] Failed to add gallery images", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to add gallery images" });
  }
};

export const deleteGalleryImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Gallery image ID is required." });
    }

    console.log("[GalleryController] Deleting gallery image id:", id);

    const [existing] = await db
      .select({
        id: galleryImages.id,
        imageUrl: galleryImages.imageUrl,
      })
      .from(galleryImages)
      .where(eq(galleryImages.id, id));

    if (!existing) {
      console.log("[GalleryController] Image not found in DB:", id);
      return res
        .status(404)
        .json({ success: false, error: "Gallery image not found." });
    }

    console.log("[GalleryController] Found image, URL:", existing.imageUrl);
    console.log("[GalleryController] Deleting from S3...");
    await deleteImageFromS3(existing.imageUrl);
    console.log("[GalleryController] S3 delete done");

    console.log("[GalleryController] Deleting from DB...");
    const [deleted] = await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, id))
      .returning({ id: galleryImages.id });

    if (!deleted) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete gallery image." });
    }

    console.log("[GalleryController] Delete successful for id:", id);
    return res.status(200).json({
      success: true,
      data: { id: deleted.id },
    });
  } catch (error) {
    console.error("[GalleryController] Failed to delete gallery image", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete gallery image" });
  }
};
