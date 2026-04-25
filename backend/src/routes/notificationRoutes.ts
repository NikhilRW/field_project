import { Router } from "express";
import {
  getNotifications,
  registerPushToken,
} from "../controllers/notificationController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getNotifications);
router.post("/register-token", authenticate, registerPushToken);

export default router;
