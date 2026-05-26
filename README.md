# Frontend

## Environment

Create a local `.env.local` from `.env.example`.

- `NEXT_PUBLIC_API_URL`: backend API base URL used by the frontend
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: required for Cloudinary image uploads and rendering
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: unsigned upload preset used by the direct upload flow

The project create/edit dialogs upload selected images directly to Cloudinary and store the returned secure URLs in the project payload.

