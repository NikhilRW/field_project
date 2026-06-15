import { Router } from "express";
import {
  createUser,
  getAllUsers,
  toggleBlockUser,
} from "../controllers/userController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getAllUsers);
router.post("/", authenticate, authorizeRoles("Admin"), createUser);
router.patch("/block", authenticate, authorizeRoles("Admin"), toggleBlockUser);

export default router;
