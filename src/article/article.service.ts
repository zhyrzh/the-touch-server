import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IParams } from './article.controller';
import { EditArticleDTO } from './dto/editArticle.dto';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async createArticle(body: CreateArticleDto) {
    try {
      await this.prismaService.article.create({
        data: {
          images: {
            createMany: {
              data: body.featuredImages.map((img: any) => ({
                publicId: img.publicId,
                url: img.url,
                name: img.name,
              })),
            },
          },
          category: body.category,
          headline: body.headline,
          content: body.content,

          author: {
            connect: body.author.map((item: any) => ({
              email: item.email,
            })),
          },
          graphicsArtist: {
            connect: body.graphicsArtist.map((item: any) => ({
              email: item.email,
            })),
          },
          photoJournalist: {
            connect: body.photoJournalist.map((item: any) => ({
              email: item.email,
            })),
          },

          createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return error;
    }
    return body;
  }

  async getLimitedRecent() {
    try {
      const data = await this.prismaService.article.findMany({
        take: 4,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          isApproved: {
            equals: false,
          },
        },

        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          images: {
            select: {
              publicId: true,
              url: true,
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async acceptArticle(id: string) {
    try {
      await this.prismaService.article.update({
        where: {
          id: Number.parseInt(id),
        },
        data: {
          isApproved: true,
        },
      });

      return {
        message: 'Article approved!',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll(params: Partial<IParams>) {
    let condition = {
      isApproved: {
        equals: false,
      },
      author: undefined,
    };
    if (params.authoredBy) {
      condition = {
        ...condition,
        author: {
          every: {
            email: {
              equals: params.authoredBy,
            },
          },
        },
      };
    }
    try {
      const data = await this.prismaService.article.findMany({
        take: 4,
        orderBy: {
          createdAt: 'desc',
        },
        where: condition,

        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          images: {
            select: {
              publicId: true,
              url: true,
            },
          },
        },
      });
      return data.map((itm) => ({
        ...itm,
        author: itm.author.map((athr) => ({
          key: athr.email,
          label: `${athr.firstName} ${athr.lastName}`,
        })),
      }));
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSpecific(id: string) {
    try {
      const data = await this.prismaService.article.findUnique({
        where: {
          id: +id,
        },
        include: {
          author: true,
          images: true,
          graphicsArtist: true,
          photoJournalist: true,
        },
      });

      return {
        ...data,
        author: data.author.map((athr) => ({
          key: athr.email,
          label: `${athr.firstName} ${athr.lastName}`,
        })),
        photoJournalist: data.photoJournalist.map((athr) => ({
          key: athr.email,
          label: `${athr.firstName} ${athr.lastName}`,
        })),
        graphicsArtist: data.graphicsArtist.map((athr) => ({
          key: athr.email,
          label: `${athr.firstName} ${athr.lastName}`,
        })),
      };
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async editArticle(body: EditArticleDTO, id: string) {
    let data = {};
    for (const val in body) {
      if (body[val] !== undefined) {
        data = {
          ...data,
          [val]: body[val],
        };
      }
    }

    console.log(data['author'], 'check data first');

    try {
      await this.prismaService.article.update({
        where: {
          id: +id,
        },
        data: {
          category: body.category ? body.category : undefined,
          content: body.content ? body.content : undefined,
          headline: body.headline ? body.headline : undefined,
          author: body.author
            ? {
                connect: body.author.connect.map((athr) => ({
                  email: athr.email,
                })),
                disconnect: body.author.disconnect.map((athr) => ({
                  email: athr.email,
                })),
              }
            : undefined,
          photoJournalist: body.photoJournalist
            ? {
                connect: body.photoJournalist.connect.map((athr) => ({
                  email: athr.email,
                })),
                disconnect: body.photoJournalist.disconnect.map((athr) => ({
                  email: athr.email,
                })),
              }
            : undefined,
          graphicsArtist: body.graphicsArtist
            ? {
                connect: body.graphicsArtist.connect.map((athr) => ({
                  email: athr.email,
                })),
                disconnect: body.graphicsArtist.disconnect.map((athr) => ({
                  email: athr.email,
                })),
              }
            : undefined,
          createdAt: body.createdAt ? body.createdAt : undefined,
          updatedAt: new Date(),
        },
      });
      return 'Edit success!';
    } catch (error) {
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
