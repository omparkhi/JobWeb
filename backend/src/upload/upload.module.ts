import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadController, FilesController } from './upload.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_DEST', './uploads'),
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE', 5242880), // 5MB
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController, FilesController],
  exports: [UploadService],
})
export class UploadModule {}