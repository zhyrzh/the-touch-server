import { Module } from '@nestjs/common';
import { UploadLibraryService } from './upload-library.service';
import { UploadLibraryController } from './upload-library.controller';

@Module({
  providers: [UploadLibraryService],
  controllers: [UploadLibraryController],
})
export class UploadLibraryModule {}
