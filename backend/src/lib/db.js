import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async() => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL)
    console.log("Connected to mongoDB:", conn.connection.host)
  } catch (error) {
    console.error("error connecting to Mongo DB")
    process.exit(1)
  }
}
