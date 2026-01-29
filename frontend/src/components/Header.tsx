import { FileCheck2 } from "lucide-react";

export const Header = () => (
  <header className="mb-10 text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/20">
        <FileCheck2 className="w-10 h-10 text-white" />
      </div>
    </div>
    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
      JusCleaner
    </h1>
    <p className="text-slate-500 mt-2 text-lg">
      Sanitização de Arquivos Jurídicos{" "}
      <span className="text-blue-600 font-medium">Otimizada para PJe e Projudi</span>.
    </p>
  </header>
);