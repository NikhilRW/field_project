import type { NextFunction, Response } from "express";
import multer from "multer";
import type { AuthRequest } from "../types/auth";
import { uploadImageToS3 } from "../utils/s3Upload";
import { compressImageBuffer } from "../utils/compressImage";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image uploads are allowed."));
  },
});

export const uploadDonationImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file?.buffer) {
      return res
        .status(400)
        .json({ success: false, error: "Donation item photo is required." });
    }

    const compressed = await compressImageBuffer(req.file.buffer);

    const result = await uploadImageToS3(compressed, "helping-hands/donations");

    req.s3Url = result.url;
    req.s3Key = result.key;
  

    return next();
  } catch (error: any) {
    console.error("Failed to upload donation image", error);
    return res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to upload donation image.",
    });
  }
};

export const uploadDonationImageOptional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file?.buffer) {
      return next();
    }

    const compressed = await compressImageBuffer(req.file.buffer);

    const result = await uploadImageToS3(compressed, "helping-hands/donations");

    req.s3Url = result.url;
    req.s3Key = result.key;

    return next();
  } catch (error: any) {
    console.error("Failed to upload donation image", error);
    return res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to upload donation image.",
    });
  }
};

export const uploadActivityImageOptional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file?.buffer) {
      return next();
    }

    const compressed = await compressImageBuffer(req.file.buffer);

    const result = await uploadImageToS3(compressed, "helping-hands/activities");

    req.s3Url = result.url;
    req.s3Key = result.key;

    return next();
  } catch (error: any) {
    console.error("Failed to upload activity image", error);
    return res.status(500).json({
      success: false,
      error: error?.message ?? "Failed to upload activity image.",
    });
  }
};
