import { Router } from "express";
import {
  getNotifications,
  registerPushToken,
  sendTestNotification,
  sendBulkTestNotification,
  unregisterPushToken,
} from "../controllers/notificationController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Existing endpoints
router.get("/", authenticate, getNotifications);
router.post("/register-token", authenticate, registerPushToken);
router.post("/unregister-token", authenticate, unregisterPushToken);

// TEST ENDPOINTS (for development/testing only)
// Send notification to a single device token


// Send notification to multiple device tokens
router.post("/test/send-bulk", authenticate, sendBulkTestNotification);

export default router;

