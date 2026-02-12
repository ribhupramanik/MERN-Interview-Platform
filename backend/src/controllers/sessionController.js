import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and deifficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem}Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in creatSession controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveSession = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "active" }).populate(
      "host",
      "name profileImage email clerkId"
    ).sort({createdAt:-1})
    .limit(20);
    res.status(200).json({sessions})
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message)
    res.status(500).json({message:"Internal Server Error"})
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user._id
    const sessions = await Session.find({
      status:"completed",
      $or:[{host:userId}, {participant: userId}],
    }).sort({createdAt:-1}).limit(20)

    res.status(200).json({sessions})
  } catch (error) {
    console.log("Error in getMySessions Controller", error.message)
    res.status(500).json({message: "Internal Server Error"})
  }
};

export const getSessionById = async (req, res) => {};

export const joinSession = async (req, res) => {};

export const endSession = async (req, res) => {};
