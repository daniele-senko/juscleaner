import { useState } from "react";
import { compressPDF } from "../services/pdf";
import { sanitizeFileName } from "../utils/fileSanitizer";
import { toast } from "sonner";

export interface ProcessedFile {
  id: string;
  originalFile: File;
  activeBlob: Blob;
  originalName: string;
  sanitizedName: string;

  originalSize: number;
  originalSizeFormatted: string;

  size: number;
  sizeFormatted: string;
  status: "ok" | "warning" | "error";
}

export const useFileHandler = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const classifyStatus = (size: number) => {
    if (size > 10 * 1024 * 1024) return "error";
    if (size > 3 * 1024 * 1024) return "warning";
    return "ok";
  };

  const formatSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;

  const addFiles = (newFiles: File[]) => {
    const mapped = newFiles.map(
      (file): ProcessedFile => ({
        id: crypto.randomUUID(),
        originalFile: file,
        activeBlob: file,
        originalName: file.name,
        sanitizedName: sanitizeFileName(file.name),

        originalSize: file.size,
        originalSizeFormatted: formatSize(file.size),

        size: file.size,
        sizeFormatted: formatSize(file.size),
        status: classifyStatus(file.size) as "ok" | "warning" | "error",
      }),
    );

    setFiles((prev) => [...prev, ...mapped]);
  };

  const optimizeFile = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    setIsCompressing(true);
    const toastId = toast.loading("Comprimindo...");

    try {
      const fileToCompress = new File(
        [target.activeBlob],
        target.originalName,
        {
          type: "application/pdf",
          lastModified: Date.now(),
        },
      );

      const compressedBlob = await compressPDF(fileToCompress);

      if (compressedBlob.size >= target.activeBlob.size) {
        toast.info("O arquivo já está no limite máximo de compressão.", {
          id: toastId,
        });
        return;
      }

      setFiles((prev) =>
        prev.map((file) =>
          file.id === id
            ? {
                ...file,
                activeBlob: compressedBlob,
                size: compressedBlob.size,
                sizeFormatted: formatSize(compressedBlob.size),
                status: classifyStatus(compressedBlob.size),
              }
            : file,
        ),
      );

      toast.success("Arquivo comprimido com sucesso!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao comprimir arquivo.", { id: toastId });
    } finally {
      setIsCompressing(false);
    }
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const clearAll = () => setFiles([]);

  return {
    files,
    addFiles,
    removeFile,
    clearAll,
    optimizeFile,
    isCompressing,
  };
};
