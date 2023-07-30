import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadLibraryService } from './upload-library.service';

@Controller('upload-library')
@UseInterceptors(FileInterceptor('image'))
export class UploadLibraryController {
  constructor(private uploadLibraryService: UploadLibraryService) {}

  @Post('image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'check file');
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    return this.uploadLibraryService.uploadImage(dataURI, file.filename);
  }
}
