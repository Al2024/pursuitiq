import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  filePath: string;
  url: string;
}

export class FileStorageService {
  private uploadDir: string;

  constructor() {
    // For now, store files in a local uploads directory
    // In production, this could be cloud storage
    this.uploadDir = path.join(process.cwd(), 'uploads');

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: File, userId?: string): Promise<FileMetadata> {
    // Generate unique filename to prevent conflicts
    const fileId = uuidv4();
    const fileExtension = path.extname(file.name);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    // Create metadata
    const metadata: FileMetadata = {
      id: fileId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date(),
      filePath,
      url: `/api/files/${fileId}` // URL for accessing the file
    };

    return metadata;
  }

  async getFile(fileId: string): Promise<Buffer | null> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const fileName = files.find(file => file.startsWith(fileId));

      if (!fileName) {
        return null;
      }

      const filePath = path.join(this.uploadDir, fileName);
      return await fs.readFile(filePath);
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const fileName = files.find(file => file.startsWith(fileId));

      if (!fileName) {
        return false;
      }

      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const fileName = files.find(file => file.startsWith(fileId));

      if (!fileName) {
        return null;
      }

      const filePath = path.join(this.uploadDir, fileName);
      const stats = await fs.stat(filePath);

      return {
        id: fileId,
        originalName: fileName.replace(fileId, '').replace(/^\./, ''),
        mimeType: this.getMimeType(fileName),
        size: stats.size,
        uploadedAt: stats.birthtime,
        filePath,
        url: `/api/files/${fileId}`
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.txt': 'text/plain',
      '.md': 'text/markdown'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async listFiles(): Promise<FileMetadata[]> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const metadataPromises = files.map(async (fileName) => {
        const fileId = fileName.split('.')[0];
        return await this.getFileMetadata(fileId);
      });

      const metadata = await Promise.all(metadataPromises);
      return metadata.filter((meta): meta is FileMetadata => meta !== null);
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

// Export singleton instance
export const fileStorage = new FileStorageService();
