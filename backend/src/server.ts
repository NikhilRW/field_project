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
import volunteerRoutes from "./routes/volunteerRoutes";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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
app.use("/api/volunteers", volunteerRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ status: "healthy", message: "backend is running" });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on port http://localhost:" + PORT);
});
