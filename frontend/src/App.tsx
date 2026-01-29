import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Trash, X, AlertCircle } from "lucide-react";
import { Toaster, toast } from "sonner";

import { useFileHandler } from "./hooks/useFileHandler";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { FileList } from "./components/FileList";
import { AdBanner } from "./components/AdBanner";

function App() {
  const { files, addFiles, removeFile, clearAll, optimizeFile, isCompressing } =
    useFileHandler();
  const [showClearModal, setShowClearModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-legal-pattern py-12 px-4 sm:px-6 font-sans text-slate-900 relative">
      <Toaster position="top-right" richColors closeButton />

      {/* MODAL DE CONFIRMAÇÃO */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-rose-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Limpar toda a lista?
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Esta ação removerá todos os arquivos carregados e processados.
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Header />

        <main className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
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
            isCompressing={isCompressing}
          />

          {files.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <button

                onClick={handleClearClick}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-rose-600 font-medium transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <Trash className="w-4 h-4" />
                Limpar tudo
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer uppercase"
              >
                <Download className="w-5 h-5 upp" />
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

        <footer className="mt-8 text-center text-slate-400 text-sm space-y-2">
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
