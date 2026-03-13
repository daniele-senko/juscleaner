import "dotenv/config";
import express from "express";
import cors from "cors";
import compressRoute from "./routes/compress";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());
app.use("/compress", compressRoute);

app.get("/", (req, res) => {
  res.send("JusCleaner API Online 🚀");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
