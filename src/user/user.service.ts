import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getProfile(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        include: {
          profile: true,
        },
      });
      return {
        email: user.email,
        profile: user.profile,
      };
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  async createProfile(body: any, email: string) {
    try {
      const createdProfile = await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          profile: {
            update: {
              course: body.course,
              firstName: body.firstName,
              lastName: body.lastName,
              position: body.position,
              profileImage: {
                update: {
                  url: body.profileImage.url,
                  publicId: body.profileImage.publicId,
                },
              },
            },
          },
        },
      });
      return {
        message: 'Success!',
        payload: {
          profile: createdProfile,
        },
      };
    } catch (error) {
      console.log(error, 'check error');
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllByPosition(position: string) {
    const condition =
      position === 'default'
        ? {
            OR: [
              {
                profile: {
                  position: {
                    equals: 'News Writer',
                  },
                },
              },
              {
                profile: {
                  position: {
                    equals: 'Feature Writer',
                  },
                },
              },
              {
                profile: {
                  position: {
                    equals: 'Sports Writer',
                  },
                },
              },
            ],
          }
        : {
            profile: {
              position,
            },
          };
    try {
      const users = await this.prismaService.user.findMany({
        select: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        where: condition,
      });
      return users;
    } catch (error) {
      return error;
    }
  }

  async getLimitedRecent() {
    try {
      const data = await this.prismaService.user.findMany({
        where: {
          isApproved: {
            equals: false,
          },
          NOT: {
            profile: null,
          },
        },
        take: 5,
        orderBy: {},
        select: {
          email: true,
          profile: {
            select: {
              course: true,
              position: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return data;
    } catch (error) {}
  }
}
