import express from "express"
import { ENV } from "./lib/env.js"
import path from "path"
import { connectDB } from "./lib/db.js"
import cors from "cors"
import {serve} from "inngest/express"
import { inngest, functions } from "./lib/inngest.js"
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js"
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoute.js"
import executeRoute from "./routes/execute.route.js";

const app = express()

const __dirname = path.resolve()

app.use(express.json())
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(clerkMiddleware())

app.use("/api/execute", executeRoute);
app.use("/api/inngest", serve({client:inngest, functions}))
app.use("/api/chat", chatRoutes)
app.use('/api/sessions', sessionRoutes)

app.get("/books", (req, res) => {
  res.status(200).json({message: "success"})
})

if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // SPA fallback ONLY for non-API routes
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const startServer = async() => {
  try {
    await connectDB()
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`)
    }) 
  } catch (error) {
    console.error("Error starting server")
  }
}

startServer()