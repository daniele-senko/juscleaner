import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { promises as fsp } from "fs";
import os from "os";
import { compressPdf } from "../utils/pdf/compress";

const router = Router();

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted"));
    }
    cb(null, true);
  },
});

router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File exceeds the 50MB limit" });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    const originalPath = req.file.path;
    const newPath = `${req.file.path}.pdf`;

    try {
      await fsp.rename(originalPath, newPath);
      console.log(`📂 Processing: ${newPath}`);

      const compressedBuffer = await compressPdf(newPath);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=compressed.pdf",
      );
      res.send(compressedBuffer);
    } catch (error: any) {
      console.error("Error:", error.message);
      res
        .status(500)
        .json({ error: "Failed to process PDF", details: error.message });
    } finally {
      try {
        await Promise.allSettled([fsp.unlink(newPath), fsp.unlink(originalPath)]);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  },
);

export default router;
