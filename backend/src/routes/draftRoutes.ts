import { Router } from "express";
import {
  createDraft,
  deleteDraft,
  getDraft,
  getDrafts,
  submitDraft,
  updateDraft,
} from "../controllers/draftController";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload, uploadDonationImage } from "../middleware/upload";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("Admin", "User"),
  upload.single("itemImage"),
  uploadDonationImage,
  createDraft,
);
router.get(
  "/",
  authenticate,
  authorizeRoles("Admin", "User"),
  getDrafts,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("Admin", "User"),
  getDraft,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("Admin", "User"),
  upload.single("itemImage"),
  uploadDonationImage,
  updateDraft,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Admin", "User"),
  deleteDraft,
);
router.post(
  "/:id/submit",
  authenticate,
  authorizeRoles("Admin", "User"),
  submitDraft,
);

export default router;
