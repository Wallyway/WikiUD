import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from a .env file into process.env

/**
 * Asynchronously connects to the MongoDB database using the connection URI
 * specified in the environment variable MONGODB_URI.
 * Logs a message to the console upon successful connection.
 * If the connection fails, logs the error message and exits the process with a status code of 1.
 *
 * @async
 * @function connectDB
 * @throws Will throw an error if the connection to MongoDB fails.
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
