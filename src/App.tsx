import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Trash } from "lucide-react";

import { useFileHandler } from "./hooks/useFileHandler";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { FileList } from "./components/FileList";

function App() {
  const { files, addFiles, removeFile, clearAll } = useFileHandler();

  const handleDownload = async () => {
    if (files.length === 0) return;

    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.sanitizedName, file.originalFile);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "arquivos_juscleaner.zip");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Header />

        <main className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
          <Dropzone onFilesAdded={addFiles} />

          <FileList files={files} onRemove={removeFile} />

          {/* Footer com Ações */}
          {files.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={clearAll}
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
