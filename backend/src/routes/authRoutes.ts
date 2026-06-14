import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/refresh", refreshToken);
router.post("/send-verification-email", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);
router.patch("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);

export default router;
