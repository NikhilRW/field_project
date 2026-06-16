import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getAnalytics);

export default router;
