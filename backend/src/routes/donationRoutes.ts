import { Router } from "express";
import {
  batchMarkItemsDonated,
  createItemDonation,
  createMoneyDonation,
  deleteDonation,
  getAllDonations,
  getDonatedItemDonations,
  getItemDonation,
  getMonthlyDonations,
  getMyDonations,
  getPendingItemDonations,
  rejectItemDonation,
  toggleItemDonatedStatus,
  verifyItemDonation,
} from "../controllers/donationController";
import { authenticate, authorizeRoles } from "../middleware/auth";
import { upload, uploadDonationImage } from "../middleware/upload";

const router = Router();

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
router.post(
  "/items/batch-mark-donated",
  authenticate,
  authorizeRoles("Admin"),
  batchMarkItemsDonated,
);
router.patch(
  "/items/:id/mark-donated",
  authenticate,
  authorizeRoles("Admin"),
  toggleItemDonatedStatus,
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
router.delete(
  "/items/:id",
  authenticate,
  authorizeRoles("Admin"),
  deleteDonation,
);

export default router;
