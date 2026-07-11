import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import donorRouter from "./routes/donor.route";
import hospitalRouter from "./routes/hospital.route";
import bloodRequestRouter from "./routes/bloodRequest.route";
import appointmentRouter from "./routes/appointment.route";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.use("/donor", donorRouter);
app.use("/hospital", hospitalRouter);
app.use("/blood-request", bloodRequestRouter);
app.use("/appointment", appointmentRouter);

export default app;