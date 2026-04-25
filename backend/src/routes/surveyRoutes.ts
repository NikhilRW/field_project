import { Router } from "express";
import { getSurveys } from "../controllers/surveyController";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeRoles("Admin"), getSurveys);

export default router;
