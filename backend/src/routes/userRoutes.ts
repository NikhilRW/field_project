import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getAllUsers);

export default router;
