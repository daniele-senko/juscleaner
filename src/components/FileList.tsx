import { FileText, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import type { ProcessedFile } from "../hooks/useFileHandler";

interface FileListProps {
  files: ProcessedFile[];
  onRemove: (id: string) => void;
}

export const FileList = ({ files, onRemove }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Arquivos Processados ({files.length})
      </h2>

      {files.map((file) => (
        <div
          key={file.id}
          className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Ícone do Arquivo */}
            <div className="bg-slate-100 p-2.5 rounded-lg group-hover:bg-blue-50 transition-colors">
              <FileText className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
              <span
                className="text-sm text-slate-400 truncate line-through decoration-rose-300 decoration-2 max-w-50"
                title={file.originalName}
              >
                {file.originalName}
              </span>
              <ArrowRight className="hidden sm:block w-4 h-4 text-slate-300" />
              <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md min-w-0 max-w-full">
                <span className="truncate" title={file.sanitizedName}>
                  {file.sanitizedName}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Botão de Excluir */}
          <button
            onClick={() => onRemove(file.id)}
            className="ml-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Remover este arquivo"
            aria-label="Remover arquivo"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};
