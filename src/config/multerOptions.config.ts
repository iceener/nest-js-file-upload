import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024 * 50, // 50MB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      done(null, true);
    } else {
      done(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = process.env.UPLOAD_TEMP_DIR;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      done(null, uploadPath);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      done(null, generateFileName(file.originalname));
    },
  }),
};

function generateFileName(originalname: string) {
  const fileExtension = extname(originalname);
  return `${originalname
    .replace(fileExtension, '')
    .toLowerCase()
    .replace(/ /g, '-')}-${uuid().slice(0, 10)}${fileExtension}`;
}
