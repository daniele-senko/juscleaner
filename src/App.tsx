import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Trash } from "lucide-react";
import { Toaster, toast } from "sonner"; // <--- Importação nova

import { useFileHandler } from "./hooks/useFileHandler";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { FileList } from "./components/FileList";

function App() {
  const { files, addFiles, removeFile, clearAll } = useFileHandler();
  const generateZip = async () => {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.sanitizedName, file.originalFile);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "arquivos_juscleaner.zip");
  };

  const handleDownload = () => {
    if (files.length === 0) {
      toast.error("A lista está vazia! Adicione arquivos primeiro.");
      return;
    }

    toast.promise(generateZip(), {
      loading: "Compactando seus arquivos...",
      success: "Tudo pronto! Download iniciado.",
      error: "Ocorreu um erro ao gerar o arquivo.",
    });
  };

  const handleClearAll = () => {
    if (confirm("Tem certeza que deseja limpar tudo?")) {
      clearAll();
      toast.info("Lista limpa com sucesso.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      {/* Componente Global de Notificações */}
      <Toaster position="top-center" richColors />

      <div className="max-w-3xl mx-auto">
        <Header />

        <main className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
          <Dropzone
            onFilesAdded={(newFiles) => {
              addFiles(newFiles);
              toast.success(`${newFiles.length} arquivo(s) adicionado(s)!`);
            }}
          />

          <FileList
            files={files}
            onRemove={(id) => {
              removeFile(id);
              toast.warning("Arquivo removido.");
            }}
          />

          {files.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={handleClearAll}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-rose-600 font-medium transition-colors cursor-pointer"
              >
                <Trash className="w-4 h-4" />
                Limpar tudo
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Baixar ZIP Higienizado
              </button>
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-slate-400 text-sm">
          <p>
            © {new Date().getFullYear()} JusCleaner. Processamento local e
            seguro.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
