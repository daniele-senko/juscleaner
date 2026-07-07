import { FileText } from "lucide-react";
import type { ProcessedFile } from "../hooks/useFileHandler";
import { FileCard } from "./FileCard";

interface FileListProps {
  files: ProcessedFile[];
  onRemove: (id: string) => void;
  onOptimize: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export const FileList = ({
  files,
  onRemove,
  onOptimize,
  onRename,
}: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Arquivos na Fila ({files.length})
      </h2>

      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onRemove={onRemove}
          onOptimize={onOptimize}
          onRename={onRename}
        />
      ))}
    </div>
  );
};
