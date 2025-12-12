import express from "express";
import dotenv from "dotenv"
import { databaseConnect } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser"
dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser())
app.use(express.json());
app.use("/",authRouter)
app.listen(PORT, () => {
  console.log("Server Strated");
  try {
    databaseConnect(),
      console.log({ message: "Database connected" });
  } catch (error) {
    
    process.exit(1);
  }
});
