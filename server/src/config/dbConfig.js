import mongoose from "mongoose";
import { envConfig } from "./envConfig.js";
import { ensureAdminExists } from "../model/index.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.DB_URL, {});

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    await ensureAdminExists();

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop the app if DB is unreachable
  }
};

export default connectDB;
