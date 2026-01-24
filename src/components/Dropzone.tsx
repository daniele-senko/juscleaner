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
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`p-4 rounded-full ${isDragActive ? "bg-blue-100" : "bg-slate-200"}`}
        >
          <UploadCloud
            className={`w-8 h-8 ${isDragActive ? "text-blue-600" : "text-slate-500"}`}
          />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700">
            {isDragActive
              ? "Solte os arquivos aqui..."
              : "Clique ou arraste seus arquivos"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            PDF, JPG ou PNG (Processamento Local)
          </p>
        </div>
      </div>
    </div>
  );
};
