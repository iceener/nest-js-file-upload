import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multerOptions.config';

@Controller('uploads')
export class UploadsController {
  @Post('file')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadFile(@UploadedFile() file) {
    return {
      filename: file.filename,
      url: `https://cloud.overment.com/${file.filename}`,
    };
  }
}
