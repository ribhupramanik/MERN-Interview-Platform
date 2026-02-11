import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_SECRET_KEY

if(!apiKey || !apiSecret){
  console.log("Stream API Key or Stream Secret is missing")
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async(userData) => {
  try {
    await chatClient.upsertUser(userData)
    console.log("User upserted successfully:", userData)
  } catch (error) {
    console.log("Error upserting Stream user", error)
  }
}

export const deleteStreamUser = async(userId) => {
  try {
    await chatClient.deleteUser(userId)
    console.log("Stream user deleted successfully", userId)
  } catch (error) {
    console.log("Error deleting Stream user", error)
  }
}