import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multerOptions.config';

@Controller('uploads')
export class UploadsController {
  @Post('file')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadFile(@Req() req, @UploadedFile() file) {
    const token = req.headers.authorization;

    if (!token || token?.split(' ')?.[1] !== process.env.API_KEY) {
      throw new UnauthorizedException('No token provided');
    }

    return {
      filename: file.filename,
      url: `https://cloud.overment.com/${
        file.path.split('/var/www/cloud/')[1]
      }`,
    };
  }
}
