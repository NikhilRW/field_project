import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("Admin", "User"),
  getDashboard,
);

export default router;
