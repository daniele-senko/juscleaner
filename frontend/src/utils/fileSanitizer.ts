export function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[(),]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}
