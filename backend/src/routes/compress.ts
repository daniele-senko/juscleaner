import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { promises as fsp, createReadStream } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { compressPdf } from "../utils/pdf/compress";

const router = Router();

const MAX_UPLOAD_SIZE_MB = process.env.MAX_UPLOAD_SIZE_MB
  ? parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10)
  : 50;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

const PDF_MAGIC = Buffer.from("%PDF-");

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted"));
    }
    cb(null, true);
  },
});

async function isPdf(filePath: string): Promise<boolean> {
  const fd = await fsp.open(filePath, "r");
  try {
    const buf = Buffer.alloc(5);
    await fd.read(buf, 0, 5, 0);
    return buf.equals(PDF_MAGIC);
  } finally {
    await fd.close();
  }
}

function logStructured(
  requestId: string,
  level: string,
  message: string,
  durationMs?: number,
) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId,
      level,
      route: "/compress",
      durationMs,
      message,
    }),
  );
}

router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ error: `File exceeds the ${MAX_UPLOAD_SIZE_MB}MB limit` });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    logStructured(requestId, "info", "Request started");

    if (!req.file) {
      logStructured(
        requestId,
        "warn",
        "No file uploaded",
        Date.now() - startTime,
      );
      return res.status(400).json({ error: "No file uploaded" });
    }

    const originalPath = req.file.path;
    const newPath = `${req.file.path}.pdf`;
    const destPath = `${req.file.path}_compressed.pdf`;

    let requestAborted = false;
    req.on("aborted", () => {
      requestAborted = true;
      logStructured(
        requestId,
        "warn",
        "Client aborted connection",
        Date.now() - startTime,
      );
    });

    try {
      if (!(await isPdf(originalPath))) {
        await fsp.unlink(originalPath).catch(() => {});
        logStructured(
          requestId,
          "warn",
          "Invalid file: not a valid PDF",
          Date.now() - startTime,
        );
        return res.status(400).json({ error: "Invalid file: not a valid PDF" });
      }

      await fsp.rename(originalPath, newPath);
      logStructured(requestId, "info", "File validated, starting compression");

      if (requestAborted) throw new Error("Request aborted before compression");

      await compressPdf(newPath, destPath, requestId);

      if (requestAborted) throw new Error("Request aborted after compression");

      logStructured(
        requestId,
        "info",
        "Compression successful, starting stream",
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=compressed.pdf",
      );

      const stream = createReadStream(destPath);
      stream.pipe(res);

      stream.on("end", () => {
        logStructured(
          requestId,
          "info",
          "Stream completed successfully",
          Date.now() - startTime,
        );
      });

      stream.on("error", (err) => {
        logStructured(
          requestId,
          "error",
          `Stream error: ${err.message}`,
          Date.now() - startTime,
        );
        if (!res.headersSent) res.status(500).end();
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logStructured(requestId, "error", errorMessage, Date.now() - startTime);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Erro interno no processamento do arquivo.",
          requestId,
        });
      }
    } finally {
      try {
        await Promise.allSettled([
          fsp.unlink(newPath),
          fsp.unlink(originalPath),
          fsp.unlink(destPath),
        ]);
        logStructured(requestId, "info", "Temporary files cleaned up");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown";
        logStructured(requestId, "error", `Cleanup error: ${msg}`);
      }
    }
  },
);

export default router;
