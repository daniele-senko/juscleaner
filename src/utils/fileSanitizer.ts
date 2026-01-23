export const sanitizeFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return fileName;

  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);

  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toLowerCase()
    .substring(0, 60);

  return `${cleanName}${extension}`;
};
