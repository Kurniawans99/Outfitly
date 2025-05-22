import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${NODE_ENV}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
