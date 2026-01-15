import mongoose from "mongoose";

export const connectDB = async () => {
    try {
    await mongoose.connect("mongodb://mongodb:27017/events");
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
