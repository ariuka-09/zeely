import { put } from "@vercel/blob";

export async function uploadAction(formData: FormData) {
  const file = formData.get("image") as File;

  // 'put' uploads the file and returns the URL
  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url; // The permanent URL of your file
}
