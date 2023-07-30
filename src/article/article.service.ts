import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/createArticle.dto';
// import { UserDTO } from './dto/user.dto';

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async createArticle(body: CreateArticleDto) {
    console.log(body, 'check body');
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
}
