import "tsconfig-paths/register";
import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import activityRoutes from "./routes/activityRoutes";
import beneficiaryRoutes from "./routes/beneficiaryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import donationRoutes from "./routes/donationRoutes";
import surveyRoutes from "./routes/surveyRoutes";
import userRoutes from "./routes/userRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import draftRoutes from "./routes/draftRoutes";
import {
  sendBulkTestNotification,
  sendTestNotification,
} from "@controllers/notificationController";
import { db } from "./config/databaseSetup";
import { sql } from "drizzle-orm";
import { schedule } from "node-cron";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/donations/drafts", draftRoutes);
app.post("/test/send", sendTestNotification);
app.post("/test/send-bulk", sendBulkTestNotification);
app.get("/", (_, res) => {
  res.status(200).json({ status: "healthy", message: "backend is running" });
});
app.set("etag", false);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on port http://localhost:" + PORT);
});

schedule(
  "0 */3 * * *",
  async () => {
    try {
      await db.execute(sql`SELECT 1`);
      console.log("Database keep-alive ping successful");
    } catch (error) {
      console.error("Database keep-alive ping failed", error);
    }
  },
  {},
);
