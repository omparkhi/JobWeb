import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:8000');
    const uploadPath = this.configService.get<string>('UPLOAD_DEST', './uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileUrl = `${baseUrl}/api/uploads/${file.filename}`;
    
    return {
      url: fileUrl,
      filename: file.filename,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const uploadPath = this.configService.get<string>('UPLOAD_DEST', './uploads');
    const filePath = path.join(uploadPath, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath(filename: string): string {
    const uploadPath = this.configService.get<string>('UPLOAD_DEST', './uploads');
    return path.join(uploadPath, filename);
  }
}