import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import path from "path";

const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
const secretKey = process.env.ILOVEPDF_SECRET_KEY;

if (!publicKey || !secretKey) {
  throw new Error(
    "Missing iLovePDF credentials. Set ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY.",
  );
}

const instance = new ILovePDFApi(publicKey, secretKey);

import crypto from "crypto";

export async function compressPdf(
  filePath: string,
  destPath: string,
  requestId: string,
  timeoutMs: number = 60000,
): Promise<void> {
  const task = instance.newTask("compress");

  // Timeout Promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error("Timeout during PDF compression")),
      timeoutMs,
    );
  });

  const processPromise = async () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        requestId,
        level: "info",
        route: "/compress",
        message: "Starting iLovePDF task",
      }),
    );
    await task.start();

    const file = new ILovePDFFile(path.resolve(filePath));
    await task.addFile(file);
    await task.process({ compression_level: "extreme" });

    const data = await task.download();
    await require("fs").promises.writeFile(destPath, Buffer.from(data as any));
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        requestId,
        level: "info",
        route: "/compress",
        message: "iLovePDF task completed and downloaded",
      }),
    );
  };

  await Promise.race([processPromise(), timeoutPromise]);
}
