import { Router } from "express";
import multer from "multer";
import fs from "fs";
import os from "os";
import { compressPdf } from "../utils/pdf/compress";

const router = Router();
const upload = multer({ dest: os.tmpdir() });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("Arquivo não enviado");

  const originalPath = req.file.path;
  const newPath = `${req.file.path}.pdf`; 

  try {
    fs.renameSync(originalPath, newPath);
    console.log(`📂 Processando: ${newPath}`);

    const compressedBuffer = await compressPdf(newPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.send(compressedBuffer);

  } catch (error: any) {
    console.error(" Erro:", error.message);
    res.status(500).json({ error: "Erro ao processar PDF", details: error.message });
  } finally {
    try {
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      else if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    } catch (e) { console.error("Erro cleanup:", e); }
  }
});

export default router;