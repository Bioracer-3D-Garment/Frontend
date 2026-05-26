// Direct Cloudinary upload is not permitted from the frontend.
// All Cloudinary interactions are handled exclusively by the backend.
// This export exists only to fail loudly if accidentally imported.
export async function uploadToCloudinary(_file: File): Promise<string> {
  throw new Error('Direct Cloudinary upload is not supported from the frontend');
}
