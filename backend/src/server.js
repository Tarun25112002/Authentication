import express from "express";
import dotenv from "dotenv";
import { databaseConnect } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

function assertEnv() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
}

app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use("/", authRouter);

async function start() {
  try {
    assertEnv();
    await databaseConnect();
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message || error);
    process.exit(1);
  }
}

start();
