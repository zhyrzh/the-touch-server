import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGetAllQueryParams } from './user.controller';

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
      const createdProfile = await this.prismaService.userProfile.create({
        data: {
          email: email,
          course: body.course,
          firstName: body.firstName,
          lastName: body.lastName,
          position: body.position,
          profileImage: {
            connect: {
              id: body.profileImage.id,
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
      throw new HttpException(
        { reason: 'Something went wrong when querying!' },
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
              profileImage: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      });

      return data;
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying!' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async acceptOrRejectUser(id: string) {
    try {
      await this.prismaService.user.update({
        where: {
          email: id,
        },
        data: {
          isApproved: true,
        },
      });

      const updatedJournalistList = await this.getLimitedRecent();

      return {
        message: 'Journalist approved!',
        updatedJournalistList: updatedJournalistList.map((data) => ({
          email: data.email,
          course: data.profile.course,
          position: data.profile.position,
          name: `${data.profile.firstName} ${data.profile.lastName}`,
          img: data.profile.profileImage.url,
        })),
      };
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying!' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll(query: Partial<IGetAllQueryParams>) {
    let condition = {};
    if (query.hasProfile !== undefined) {
      if (query.hasProfile)
        condition = {
          ...condition,
          NOT: {
            profile: null,
          },
        };
      else
        condition = {
          profile: {
            is: null,
          },
        };
    }
    if (query.isApproved !== undefined) {
      condition = {
        isApproved: {
          equals: query.isApproved,
        },
      };
    }
    if (query.position) {
      condition = {
        ...condition,
        profile: {
          position: {
            equals: query.position,
          },
        },
      };
    }

    try {
      const data = await this.prismaService.user.findMany({
        where: condition,
        take: 5,
        // orderBy: {},
        select: {
          email: true,
          profile: {
            select: {
              course: true,
              position: true,
              firstName: true,
              lastName: true,
              profileImage: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      });
      return data.map((item) => ({
        email: item.email,
        name: `${item.profile.firstName} ${item.profile.lastName}`,
        position: item.profile.position,
        course: item.profile.course,
        img: item.profile.profileImage.url,
      }));
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'something';
  }
}
