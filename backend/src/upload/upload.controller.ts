import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards,
  Get,
  Param,
  Res,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('resume')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload resume file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new NotFoundException('Invalid file type. Only PDF and DOC files are allowed');
    }

    return this.uploadService.uploadFile(file);
  }

  @Post('logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Logo uploaded successfully' })
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new NotFoundException('Invalid file type. Only image files are allowed');
    }

    return this.uploadService.uploadFile(file);
  }
}

@Controller('uploads')
export class FilesController {
  constructor(private uploadService: UploadService) {}

  @Get(':filename')
  @ApiOperation({ summary: 'Get uploaded file' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.uploadService.getFilePath(filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(filePath, { root: '.' });
  }
}