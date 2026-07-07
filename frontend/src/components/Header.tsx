import { FileCheck2, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="mb-10 relative">
      <div className="absolute top-0 right-0 flex gap-2">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-full transition-colors ${theme === "light" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          title="Tema Claro"
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          title="Tema Escuro"
        >
          <Moon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded-full transition-colors ${theme === "system" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          title="Usar Tema do Sistema"
        >
          <Monitor className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center pt-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/20">
            <FileCheck2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          JusCleaner
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Sanitização de Arquivos Jurídicos{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Otimizada para PJe e Projudi
          </span>
          .
        </p>
      </div>
    </header>
  );
};
