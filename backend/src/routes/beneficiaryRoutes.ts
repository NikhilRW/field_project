import { Router } from "express";
import {
  createBeneficiary,
  getBeneficiaries,
} from "../controllers/beneficiaryController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getBeneficiaries);
router.post("/", authenticate, authorizeRoles("Admin"), createBeneficiary);

export default router;
