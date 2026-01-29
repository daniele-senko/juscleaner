import { Share2, Heart } from "lucide-react";

interface AdBannerProps {
  format?: "horizontal" | "rectangle";
}

export const AdBanner = ({ format = "horizontal" }: AdBannerProps) => {
  return (
    <div
      className={`
        w-full mx-auto my-6 bg-indigo-50/50 border border-indigo-100 rounded-xl 
        flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 gap-4
        ${format === "horizontal" ? "max-w-3xl" : "max-w-75"}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
          <Heart className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-indigo-900">
            Ferramenta gratuita e segura
          </h3>
          <p className="text-xs text-indigo-600/80">
            Ajude o JusCleaner a crescer compartilhando com colegas.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "JusCleaner",
              text: "Comprima arquivos para PJe e Projudi com segurança.",
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copiado para a área de transferência!");
          }
        }}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <Share2 className="w-3 h-3" />
        Compartilhar
      </button>
    </div>
  );
};
