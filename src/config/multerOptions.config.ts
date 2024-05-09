import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024 * 50, // 50MB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    console.log(file.mimetype);
    if (
      file.mimetype.match(
        /\/(jpg|jpeg|png|gif|pdf|doc|docx|mp3|wav|m4a|markdown|md|json|zip|plain)$/,
      )
    ) {
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
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, destination: string) => void,
    ) {
      const date = format(new Date(), 'yyyy-MM-dd');
      const uploadPath = `${process.env.UPLOAD_TEMP_DIR}/${date}`;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
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
