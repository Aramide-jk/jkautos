import { put, del } from "@vercel/blob";

/** Upload an image to Vercel Blob and return its public URL. */
export async function uploadImage(file: File, prefix = "cars") {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return put(`${prefix}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
}

export { del as deleteBlob };
