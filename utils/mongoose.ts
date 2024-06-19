import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MISSING MONGODB URL");

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB,
    });
    isConnected = true;

    console.log("MongoDB is connected");
  } catch (err) {
    console.log("MongoDB connection failed", err);
  }
};
