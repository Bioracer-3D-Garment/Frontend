export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "next_unsigned";

  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Add it to your .env.local file before uploading images.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const requestInit = {
    method: "POST",
    body: formData,
  } as RequestInit;

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, requestInit);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload failed");
  }

  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return a secure URL");
  }

  return data.secure_url;
}
