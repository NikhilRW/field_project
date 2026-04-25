import { Router } from "express";
import { getVolunteers } from "../controllers/volunteerController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getVolunteers);

export default router;
