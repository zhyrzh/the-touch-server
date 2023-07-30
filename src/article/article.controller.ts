import { Body, Controller, Post } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  async createArticle(@Body() body: CreateArticleDto) {
    return this.articleService.createArticle(body);
  }
}
