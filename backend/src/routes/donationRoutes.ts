import { Router } from "express";
import {
  createItemDonation,
  createMoneyDonationOrder,
  getDonations,
  getDonatedItemDonations,
  getItemDonation,
  getMonthlyDonations,
  getMyDonations,
  getPendingItemDonations,
  markMoneyDonationFailed,
  rejectItemDonation,
  verifyItemDonation,
  verifyMoneyDonation,
} from "../controllers/donationController";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload, uploadDonationImage } from "../middleware/upload";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getDonations);
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
  authorizeRoles("Admin", "Volunteer", "Donor"),
  getDonatedItemDonations,
);
router.get(
  "/items/:id",
  authenticate,
  authorizeRoles("Admin", "Volunteer", "Donor"),
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
router.get(
  "/mine",
  authenticate,
  authorizeRoles("Volunteer", "Donor"),
  getMyDonations,
);
router.post(
  "/item",
  authenticate,
  authorizeRoles("Volunteer", "Donor"),
  upload.single("itemImage"),
  uploadDonationImage,
  createItemDonation,
);
router.post(
  "/money/order",
  authenticate,
  authorizeRoles("Volunteer", "Donor"),
  createMoneyDonationOrder,
);
router.post(
  "/money/verify",
  authenticate,
  authorizeRoles("Volunteer", "Donor"),
  verifyMoneyDonation,
);
router.post(
  "/money/failure",
  authenticate,
  authorizeRoles("Volunteer", "Donor"),
  markMoneyDonationFailed,
);

export default router;
