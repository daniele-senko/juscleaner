import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const Dropzone = ({ onFilesAdded }: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`p-4 rounded-full ${isDragActive ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-200 dark:bg-slate-800"}`}
        >
          <UploadCloud
            className={`w-8 h-8 ${isDragActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
          />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
            {isDragActive
              ? "Solte os arquivos aqui..."
              : "Clique ou arraste seus arquivos PDF"}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Múltiplos arquivos suportados (Compressão Inteligente e Segura)
          </p>
        </div>
      </div>
    </div>
  );
};
