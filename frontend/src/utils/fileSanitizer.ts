export function sanitizeFileName(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot !== -1 ? name.slice(lastDot).toLowerCase() : "";
  const baseName = lastDot !== -1 ? name.slice(0, lastDot) : name;
  const sanitizedBase = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9_-]/g, "_") // substitui tudo que não for alfanumérico
    .replace(/_+/g, "_") // colapsa múltiplos underscores
    .replace(/^_+|_+$/g, "") // remove underscores no início e fim
    .toLowerCase();

  const safeBase = sanitizedBase || "arquivo";

  return safeBase + ext;
}
