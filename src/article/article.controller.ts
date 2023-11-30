import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleService } from './article.service';

export interface IParams {
  limit: string;
  page: string;
  authoredBy: string;
}
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  async createArticle(@Body() body: CreateArticleDto) {
    return this.articleService.createArticle(body);
  }

  @Put('/accept-reject/:id')
  async acceptArticle(@Param('id') id: string) {
    return this.articleService.acceptArticle(id);
  }

  @Get('/all')
  async getAll(@Query() params: Partial<IParams>) {
    return this.articleService.getAll(params);
  }
}
