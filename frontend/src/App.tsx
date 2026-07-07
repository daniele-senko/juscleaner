import { useState, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  Trash,
  X,
  AlertCircle,
  Wand2,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { Toaster, toast } from "sonner";

import { useFileHandler } from "./hooks/useFileHandler";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { FileList } from "./components/FileList";
import { AdBanner } from "./components/AdBanner";

function App() {
  const {
    files,
    addFiles,
    removeFile,
    clearAll,
    optimizeFile,
    optimizeAll,
    isOptimizingAll,
    updateFileName,
  } = useFileHandler();

  const [showClearModal, setShowClearModal] = useState(false);
  const [globalDragActive, setGlobalDragActive] = useState(false);

  const generateZip = async () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.sanitizedName, file.activeBlob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "arquivos_juscleaner.zip");
  };

  const handleDownload = () => {
    if (files.length === 0) {
      toast.error("Adicione arquivos primeiro.");
      return;
    }

    if (files.length === 1) {
      const file = files[0];
      saveAs(file.activeBlob, file.sanitizedName);
      toast.success("Download iniciado!");
    } else {
      toast.promise(generateZip(), {
        loading: "Gerando ZIP agrupado...",
        success: "Download do pacote iniciado!",
        error: "Erro ao gerar arquivo.",
      });
    }
  };

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    clearAll();
    setShowClearModal(false);
    toast.info("Lista limpa com sucesso.");
  };

  // Global Drag & Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setGlobalDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGlobalDragActive(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!globalDragActive) setGlobalDragActive(true);
    },
    [globalDragActive],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setGlobalDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files).filter(
          (f) => f.type === "application/pdf",
        );
        if (droppedFiles.length > 0) {
          addFiles(droppedFiles);
          toast.success(`${droppedFiles.length} arquivo(s) preparado(s).`);
        } else {
          toast.error("Nenhum PDF válido encontrado.");
        }
      }
    },
    [addFiles],
  );

  return (
    <div
      className="min-h-screen bg-legal-pattern dark:bg-slate-950 dark:bg-none py-12 px-4 sm:px-6 font-sans text-slate-900 dark:text-slate-100 relative transition-colors"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Toaster position="top-right" richColors closeButton theme="system" />

      {/* GLOBAL DRAG OVERLAY */}
      {globalDragActive && (
        <div className="fixed inset-0 z-[100] bg-blue-500/20 dark:bg-blue-900/40 backdrop-blur-sm border-4 border-blue-500 border-dashed m-4 rounded-3xl flex items-center justify-center pointer-events-none animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <UploadCloud className="w-16 h-16 text-blue-500 animate-bounce" />
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Solte os arquivos PDF aqui
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Limpar toda a lista?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Esta ação removerá todos os arquivos carregados e processados.
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 dark:bg-rose-700 text-white font-medium hover:bg-rose-700 dark:hover:bg-rose-600 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Header />

        <main className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 relative z-10">
          <Dropzone
            onFilesAdded={(newFiles) => {
              addFiles(newFiles);
              toast.success(`${newFiles.length} arquivo(s) preparado(s).`);
            }}
          />

          <FileList
            files={files}
            onRemove={(id) => {
              removeFile(id);
              toast.warning("Arquivo removido.");
            }}
            onOptimize={optimizeFile}
            onRename={updateFileName}
          />

          {files.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleClearClick}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <Trash className="w-4 h-4" />
                Limpar tudo
              </button>

              {files.length > 1 && (
                <button
                  onClick={optimizeAll}
                  disabled={isOptimizingAll}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  {isOptimizingAll ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Comprimir todos
                </button>
              )}

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer uppercase"
              >
                <Download className="w-5 h-5" />
                {files.length > 1
                  ? "Baixar ZIP Higienizado"
                  : "Baixar Arquivo Pronto"}
              </button>
            </div>
          )}
        </main>

        <div className="mt-8">
          <AdBanner format="horizontal" />
        </div>

        <footer className="mt-8 text-center text-slate-400 dark:text-slate-500 text-sm space-y-2">
          <p>
            © {new Date().getFullYear()} JusCleaner. Ferramenta para advogados.
          </p>
          <p className="text-xs opacity-75">
            Arquivos deletados imediatamente após o uso.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
