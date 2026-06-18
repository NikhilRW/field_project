import { Router } from "express";
import {
  createItemDonation,
  createMoneyDonation,
  getAllDonations,
  getDonations,
  getDonatedItemDonations,
  getItemDonation,
  getMonthlyDonations,
  getMyDonations,
  getPendingItemDonations,
  markItemAsDonated,
  rejectItemDonation,
  verifyItemDonation,
} from "../controllers/donationController";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload, uploadDonationImage } from "../middleware/upload";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getDonations);
router.get(
  "/all",
  authenticate,
  authorizeRoles("Admin"),
  getAllDonations,
);
router.get(
  "/monthly",
  authenticate,
  authorizeRoles("Admin"),
  getMonthlyDonations,
);
router.get(
  "/items/pending",
  authenticate,
  authorizeRoles("Admin"),
  getPendingItemDonations,
);
router.get(
  "/items/donated",
  authenticate,
  authorizeRoles("Admin", "User"),
  getDonatedItemDonations,
);
router.get(
  "/items/:id",
  authenticate,
  authorizeRoles("Admin", "User"),
  getItemDonation,
);
router.patch(
  "/items/:id/verify",
  authenticate,
  authorizeRoles("Admin"),
  verifyItemDonation,
);
router.patch(
  "/items/:id/reject",
  authenticate,
  authorizeRoles("Admin"),
  rejectItemDonation,
);
router.patch(
  "/items/:id/mark-donated",
  authenticate,
  authorizeRoles("Admin"),
  markItemAsDonated,
);
router.get(
  "/mine",
  authenticate,
  authorizeRoles("Admin", "User"),
  getMyDonations,
);
router.post(
  "/item",
  authenticate,
  authorizeRoles("Admin", "User"),
  upload.single("itemImage"),
  uploadDonationImage,
  createItemDonation,
);
router.post(
  "/money",
  authenticate,
  authorizeRoles("Admin"),
  createMoneyDonation,
);

export default router;
