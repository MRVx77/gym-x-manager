import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function uploadImage(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Upload failed"));
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export default cloudinary;
