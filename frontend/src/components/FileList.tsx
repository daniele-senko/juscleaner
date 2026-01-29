import {
  FileText,
  Trash2,
  CheckCircle2,
  Wand2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import type { ProcessedFile } from "../hooks/useFileHandler";

interface FileListProps {
  files: ProcessedFile[];
  onRemove: (id: string) => void;
  onOptimize: (id: string) => void;
  isCompressing?: boolean;
}

export const FileList = ({
  files,
  onRemove,
  onOptimize,
  isCompressing = false,
}: FileListProps) => {
  if (files.length === 0) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nome copiado!");
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Arquivos na Fila ({files.length})
      </h2>

      {files.map((file) => {
        // Lógica visual: Calcula a redução apenas para exibir
        const isOptimized = file.size < file.originalSize;
        const reduction = isOptimized
          ? Math.round(
              ((file.originalSize - file.size) / file.originalSize) * 100,
            )
          : 0;

        return (
          <div
            key={file.id}
            className={`
              group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 
              bg-white border rounded-xl transition-all duration-200 shadow-sm
              ${isOptimized ? "border-emerald-100 bg-emerald-50/30" : "border-slate-200 hover:border-blue-300 hover:shadow-md"}
            `}
          >
            {/* Ícone e Informações */}
            <div className="flex items-center gap-4 flex-1 w-full sm:w-auto overflow-hidden">
              <div
                className={`p-3 rounded-xl shrink-0 transition-colors ${
                  file.status === "error"
                    ? "bg-rose-100 text-rose-600"
                    : isOptimized
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {isOptimized ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                {/* Nome do Arquivo */}
                <button
                  onClick={() => copyToClipboard(file.sanitizedName)}
                  className="text-left group/name"
                  title="Clique para copiar"
                >
                  <span className="block text-sm font-semibold text-slate-700 truncate group-hover/name:text-blue-600 transition-colors">
                    {file.sanitizedName}
                  </span>
                  <span className="text-xs text-slate-400 truncate flex items-center gap-1">
                    Original: {file.originalName}
                  </span>
                </button>

                {/* Badges de Status (Onde a mágica do UX acontece) */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {isOptimized ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md animate-pop">
                      <span className="line-through opacity-50">
                        {file.originalSizeFormatted}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{file.sizeFormatted}</span>
                      <span className="ml-1 bg-emerald-200 px-1 rounded text-[10px]">
                        -{reduction}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {file.sizeFormatted}
                    </span>
                  )}

                  {file.status === "warning" && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      <AlertTriangle className="w-3 h-3" /> Atenção ({">"}3MB)
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="flex items-center gap-1 text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-bold">
                      <AlertCircle className="w-3 h-3" /> Recusado no PJe ({">"}
                      10MB)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-center">
              {file.size > 100 * 1024 && (
                <button
                  onClick={() => onOptimize(file.id)}
                  disabled={isCompressing}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                    ${
                      isCompressing
                        ? "bg-slate-100 text-slate-400 cursor-wait"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 shadow-sm hover:shadow"
                    }
                  `}
                >
                  {isCompressing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  {isOptimized ? "Recomprimir" : "Comprimir"}
                </button>
              )}

              <button
                onClick={() => onRemove(file.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remover arquivo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
