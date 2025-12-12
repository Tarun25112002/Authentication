import mongoose from "mongoose";

export async function databaseConnect() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(process.env.MONGODB_URI);
}
