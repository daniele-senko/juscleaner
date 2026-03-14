const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export async function compressPDF(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error(`API error: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.open("POST", `${API_URL}/compress`);
    xhr.responseType = "blob";
    xhr.send(formData);
  });
}
