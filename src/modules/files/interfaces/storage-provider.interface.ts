export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface StorageProvider {
  /**
   * Upload a file and return its storage details
   */
  upload(file: MulterFile, folder?: string): Promise<UploadedFile>;

  /**
   * Delete a file by its key
   */
  delete(key: string): Promise<boolean>;
}
