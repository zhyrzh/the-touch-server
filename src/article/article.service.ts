import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/createArticle.dto';

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

          createdAt: new Date(),
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

      const updatedArticleList = await this.getLimitedRecent();

      return {
        message: 'Article approved!',
        updatedArticleList: updatedArticleList.map((data) => ({
          headline: data.headline,
          createdAt: data.createdAt,
          authors: data.author.map((athr) => ({
            name: `${athr.firstName} ${athr.lastName}`,
            email: athr.email,
          })),
          images: data.images.map((athr) => ({
            url: athr.url,
            publicId: athr.publicId,
          })),
        })),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { reason: 'Something went wrong when querying' + error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
