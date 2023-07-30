import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getProfile(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
    return user;
  }

  async createProfile(body: any, email: string) {
    const createdProfile = await this.prismaService.userProfile.create({
      data: {
        course: body.course,
        firstName: body.firstName,
        lastName: body.lastName,
        position: body.position,
        email,
        profileImage: {
          create: {
            url: body.profileImage.url,
            publicId: body.profileImage.publicId,
          },
        },
      },
    });
    return createdProfile;
  }
}
