import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivityStatus,
} from "../controllers/activityController";
import { authenticate, authorizeRoles } from "../middleware/auth";

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

router.post("/", authenticate, authorizeRoles("Admin"), createActivity);

router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteActivity);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("Admin"),
  updateActivityStatus,
);

export default router;
