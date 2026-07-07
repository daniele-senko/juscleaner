import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compressRoute from "./routes/compress";

import { promises as fsp } from "fs";
import os from "os";
import path from "path";

const app = express();
app.set("trust proxy", 1); // Trust the first proxy (Render load balancer)

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requests per window
  message: { error: "Too many requests, please try again later" },
});

app.use(express.json());
app.use("/compress", limiter, compressRoute);

app.get("/", (req, res) => {
  res.send("JusCleaner API Online 🚀");
});

const PORT = process.env.PORT || 3333;

async function cleanupOrphans() {
  try {
    const tmpDir = os.tmpdir();
    const files = await fsp.readdir(tmpDir);
    // Remove old files matching typical multer or compressed patterns created by this app
    const now = Date.now();
    for (const file of files) {
      if (file.endsWith(".pdf") || file.includes("compressed")) {
        const filePath = path.join(tmpDir, file);
        const stats = await fsp.stat(filePath);
        // If older than 1 hour, remove
        if (now - stats.mtimeMs > 60 * 60 * 1000) {
          await fsp.unlink(filePath).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error("Failed to cleanup orphans:", err);
  }
}

app.listen(PORT, async () => {
  await cleanupOrphans();
  console.log(`✅ Server running on port ${PORT}`);
});
