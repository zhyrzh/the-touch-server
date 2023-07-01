import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getProfile() {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: 'admin@gmail.com',
      },
      include: {
        profile: true,
      },
    });
    return user;
  }
}
