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

const instance = new ILovePDFApi(
  publicKey,
  secretKey,
);

export async function compressPdf(filePath: string): Promise<Buffer> {
  const task = instance.newTask("compress");

  await task.start();

  const file = new ILovePDFFile(path.resolve(filePath));
  await task.addFile(file);

  await task.process({ compression_level: "extreme" });

  const data = await task.download();

  return Buffer.from(data);
}
