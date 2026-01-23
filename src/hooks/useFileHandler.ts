import { useState, useCallback } from "react";
import { sanitizeFileName } from "../utils/fileSanitizer";

export interface ProcessedFile {
  id: string;
  originalFile: File;
  originalName: string;
  sanitizedName: string;
}

export const useFileHandler = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const processed = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      originalFile: file,
      originalName: file.name,
      sanitizedName: sanitizeFileName(file.name),
    }));

    setFiles((prev) => [...prev, ...processed]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFileName = useCallback((id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, sanitizedName: newName } : f)),
    );
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    updateFileName,
    clearAll,
  };
};
