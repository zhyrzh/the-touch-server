import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as cloudianry from 'cloudinary';

cloudianry.v2.config({
  cloud_name: 'rhyzschoolwebapp',
  api_key: '311467433777757',
  api_secret: 'PxJ2HBphKbE_b90HiORiTPRNNZg',
});

@Injectable()
export class UploadLibraryService {
  constructor(private prismaService: PrismaService) {}

  async uploadProfileImage(file: string, filename: string, email: string) {
    const { public_id: publicId, url } = await cloudianry.v2.uploader.upload(
      file,
      {
        upload_preset: 'the-touch-assets',
      },
    );

    const uploadedAsset = await this.prismaService.userAssets.create({
      data: {
        url: url,
        publicId: publicId,
        userProfileEmail: email,
      },
    });

    return {
      ...uploadedAsset,
      filename,
    };
  }

  async uploadImage(file: string, filename: string) {
    try {
      const {
        public_id: publicId,
        url,
        ...rest
      } = await cloudianry.v2.uploader.upload(file, {
        upload_preset: 'the-touch-assets',
      });

      const uploadedAsset = await this.prismaService.articleAssets.create({
        data: {
          url: url,
          publicId: publicId,
        },
      });

      return {
        ...uploadedAsset,
        publicId,
        filename,
        signature: rest.signature,
        // secure_url,
      };
    } catch (error) {}
  }
}
