import { v4 as uuidv4 } from 'uuid';
import admin from './firebaseAdmin';
import path from 'path';

export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  filePath: string; // gs path
  url: string; // serving URL or API route
}

class FirebaseStorageService {
  private bucket = admin.storage().bucket();
  private prefix = 'uploads';

  private getExt(name: string) {
    return path.extname(name) || '';
  }

  async saveFile(file: File): Promise<FileMetadata> {
    const id = uuidv4();
    const ext = this.getExt(file.name);
    const objectPath = `${this.prefix}/${id}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const gcsFile = this.bucket.file(objectPath);
    try {
      await gcsFile.save(buffer, {
        resumable: false,
        contentType: file.type || 'application/octet-stream',
        metadata: {
          metadata: { originalName: file.name },
        },
      });
    } catch (err: any) {
      // Enhance 404 (bucket not found) clarity for production debugging
      const bucketName = this.bucket?.name;
      const code = err?.code;
      if (code === 404) {
        err.message = `${err.message} (Bucket: '${bucketName}'). This usually means the Firebase Storage bucket was never created or the env var FIREBASE_STORAGE_BUCKET='${bucketName}' is wrong. Login to Firebase Console > Storage and click 'Get started' to provision the default bucket (normally <project-id>.appspot.com). Ensure the service account has Storage Object Admin (or Editor) role.`;
      }
      console.error('Firebase Storage upload failed', { bucketName, objectPath, code, originalError: err?.message });
      throw err;
    }

    // Prefer serving through our API for consistency
    const meta: FileMetadata = {
      id,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: buffer.byteLength,
      uploadedAt: new Date(),
      filePath: `gs://${this.bucket.name}/${objectPath}`,
      url: `/api/files/${id}`,
    };
    return meta;
  }

  async getFileBuffer(fileId: string): Promise<Buffer | null> {
    const [files] = await this.bucket.getFiles({ prefix: `${this.prefix}/${fileId}` });
    const f = files?.[0];
    if (!f) return null;
    const [data] = await f.download();
    return data;
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    const [files] = await this.bucket.getFiles({ prefix: `${this.prefix}/${fileId}` });
    const f = files?.[0];
    if (!f) return null;
    const [md] = await f.getMetadata();
  const originalName = String(md.metadata?.originalName || f.name.split('/').pop() || fileId);
    return {
      id: fileId,
      originalName,
      mimeType: md.contentType || 'application/octet-stream',
      size: Number(md.size || 0),
      uploadedAt: new Date(md.timeCreated || md.updated || Date.now()),
      filePath: `gs://${this.bucket.name}/${f.name}`,
      url: `/api/files/${fileId}`,
    };
  }
}

export const firebaseStorage = new FirebaseStorageService();
export type { FileMetadata as FirebaseFileMetadata };
