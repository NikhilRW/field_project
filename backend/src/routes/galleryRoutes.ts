import { Router } from "express";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { uploadGalleryImages } from "../middleware/upload";
import {
  getGalleryImages,
  addGalleryImages,
  deleteGalleryImage,
} from "../controllers/galleryController";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getGalleryImages);
router.post(
  "/",
  authenticate,
  authorizeRoles("Admin"),
  upload.array("galleryImages", 20),
  uploadGalleryImages,
  addGalleryImages,
);
router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteGalleryImage);

export default router;
