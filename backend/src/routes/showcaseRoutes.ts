import { Router } from "express";
import { getActivities } from "../controllers/activityController";
import { getPublicDonations } from "../controllers/donationController";
import { getGalleryImages } from "../controllers/galleryController";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

const router = Router();

router.get("/activities", apiKeyAuth, getActivities);
router.get("/donations", apiKeyAuth, getPublicDonations);
router.get("/gallery", apiKeyAuth, getGalleryImages);

export default router;
