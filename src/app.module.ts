import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UploadLibraryModule } from './upload-library/upload-library.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    UploadLibraryModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
