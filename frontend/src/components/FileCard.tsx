import { useState } from "react";
import {
  FileText,
  Trash2,
  CheckCircle2,
  Wand2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { ProcessedFile } from "../hooks/useFileHandler";
import { sanitizeFileName } from "../utils/fileSanitizer";

interface FileCardProps {
  file: ProcessedFile;
  onRemove: (id: string) => void;
  onOptimize: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export const FileCard = ({
  file,
  onRemove,
  onOptimize,
  onRename,
}: FileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(file.sanitizedName);

  const isOptimized = file.size < file.originalSize;
  const reduction = isOptimized
    ? Math.round(((file.originalSize - file.size) / file.originalSize) * 100)
    : 0;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Nome copiado!");
    } catch {
      toast.error(
        "Não foi possível copiar automaticamente. Copie manualmente.",
      );
    }
  };

  const confirmEdit = () => {
    const sanitized = sanitizeFileName(editValue);
    if (!sanitized) {
      toast.error("Nome inválido.");
      return;
    }
    onRename(file.id, sanitized);
    setIsEditing(false);
    toast.success("Nome atualizado!");
  };

  const cancelEdit = () => {
    setEditValue(file.sanitizedName);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 
        bg-white dark:bg-slate-800 border rounded-xl transition-all duration-200 shadow-sm
        ${isOptimized ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"}
      `}
    >
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto overflow-hidden">
        <div
          className={`p-3 rounded-xl shrink-0 transition-colors ${
            file.status === "error"
              ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
              : isOptimized
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
          }`}
        >
          {isOptimized ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                aria-label="Novo nome do arquivo"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 border-b border-blue-400 bg-transparent outline-none w-full"
              />
              <button
                onClick={confirmEdit}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                title="Confirmar"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/name">
              <button
                onClick={() => copyToClipboard(file.sanitizedName)}
                className="text-left min-w-0"
                title="Clique para copiar"
              >
                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 truncate group-hover/name:text-blue-600 dark:group-hover/name:text-blue-400 transition-colors">
                  {file.sanitizedName}
                </span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                title="Editar nome"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
            Original: {file.originalName}
          </span>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {isOptimized ? (
              <div className="flex items-center gap-1.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md animate-pop">
                <span className="sr-only">Status: Sucesso. Reduzido de </span>
                <span className="line-through opacity-50">
                  {file.originalSizeFormatted}
                </span>
                <ArrowRight className="w-3 h-3" />
                <span className="sr-only"> para </span>
                <span>{file.sizeFormatted}</span>
                <span className="ml-1 bg-emerald-200 dark:bg-emerald-800/50 px-1 rounded text-[10px]">
                  -{reduction}%
                </span>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border dark:border-slate-700">
                <span className="sr-only">Tamanho atual: </span>
                {file.sizeFormatted}
              </span>
            )}
            {file.status === "warning" && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-800/50">
                <AlertTriangle className="w-3 h-3" />{" "}
                <span className="sr-only">Aviso: </span> Atenção ({">"}3MB)
              </span>
            )}
            {file.status === "error" && (
              <span className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-800/50 font-bold">
                <AlertCircle className="w-3 h-3" />{" "}
                <span className="sr-only">Erro: </span> Recusado no PJe ({">"}
                10MB)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-center">
        {file.size > 100 * 1024 && (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => onOptimize(file.id)}
              disabled={file.isCompressing}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${
                  file.isCompressing
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-wait"
                    : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/50 shadow-sm hover:shadow"
                }
              `}
            >
              {file.isCompressing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              {isOptimized ? "Recomprimir" : "Comprimir"}
            </button>
            {file.isCompressing && (
              <div className="w-full flex items-center gap-2">
                {file.uploadProgress < 100 ? (
                  <>
                    <div
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={file.uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                      {file.uploadProgress}%
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                      role="progressbar"
                    >
                      <div className="h-full bg-indigo-400 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                      Processando...
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onRemove(file.id)}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
