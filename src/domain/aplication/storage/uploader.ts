import type { Upload } from "@/domain/enterprise/upload-entity";

export interface Uploader {
  upload(upload: Upload): Promise<{ result: string }>;
  deleteUpload(id: string): Promise<void>;
  getSignedImageURL(id: string): Promise<string>;
}
