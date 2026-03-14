import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compressRoute from "./routes/compress";

const app = express();

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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
