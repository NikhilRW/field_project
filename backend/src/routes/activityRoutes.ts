import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivityStatus,
} from "../controllers/activityController";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload, uploadActivityImageOptional } from "../middleware/upload";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("Admin", "User"),
  getActivities,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("Admin", "User"),
  getActivityById,
);

router.post(
  "/",
  authenticate,
  authorizeRoles("Admin"),
  upload.single("activityImage"),
  uploadActivityImageOptional,
  createActivity,
);

router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteActivity);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("Admin"),
  updateActivityStatus,
);

export default router;
