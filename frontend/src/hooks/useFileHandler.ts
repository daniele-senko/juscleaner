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
  isCompressing: boolean;
}

export const useFileHandler = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);

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
        isCompressing: false,
      }),
    );

    setFiles((prev) => [...prev, ...mapped]);
  };

  const optimizeFile = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isCompressing: true } : f)),
    );
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
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isCompressing: false } : f)),
      );
    }
  };

  const optimizeAll = async () => {
    const targets = files.filter(
      (f) => f.size > 100 * 1024 && !f.isCompressing,
    );
    if (targets.length === 0) return;

    setIsOptimizingAll(true);
    const toastId = toast.loading(`Comprimindo 1 de ${targets.length}...`);

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      toast.loading(`Comprimindo ${i + 1} de ${targets.length}...`, {
        id: toastId,
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === target.id ? { ...f, isCompressing: true } : f,
        ),
      );

      try {
        const fileToCompress = new File(
          [target.activeBlob],
          target.originalName,
          { type: "application/pdf", lastModified: Date.now() },
        );

        const compressedBlob = await compressPDF(fileToCompress);

        if (compressedBlob.size < target.activeBlob.size) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === target.id
                ? {
                    ...f,
                    activeBlob: compressedBlob,
                    size: compressedBlob.size,
                    sizeFormatted: formatSize(compressedBlob.size),
                    status: classifyStatus(compressedBlob.size),
                  }
                : f,
            ),
          );
        }
      } catch (error) {
        console.error(`Error compressing ${target.originalName}:`, error);
      } finally {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === target.id ? { ...f, isCompressing: false } : f,
          ),
        );
      }
    }

    toast.success(`${targets.length} arquivo(s) comprimido(s)!`, {
      id: toastId,
    });
    setIsOptimizingAll(false);
  };

  const updateFileName = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sanitizedName: newName } : f)),
    );
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
    optimizeAll,
    isOptimizingAll,
    updateFileName,
  };
};
