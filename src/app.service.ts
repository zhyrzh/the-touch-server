import { Injectable } from '@nestjs/common';
import { ArticleService } from './article/article.service';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private articleService: ArticleService,
    private userService: UserService,
  ) {}

  async getAllHomePageData() {
    const articleData = await this.articleService.getLimitedRecent();
    const journalistData = await this.userService.getLimitedRecent();

    const normalizedArticleData = articleData.map((data) => ({
      headline: data.headline,
      createdAt: data.createdAt,
      authors: data.author.map((athr) => ({
        name: `${athr.firstName} ${athr.lastName}`,
        email: athr.email,
      })),
    }));

    const normalizedJournalistData = journalistData.map((data) => ({
      email: data.email,
      course: data.profile.course,
      position: data.profile.position,
      name: `${data.profile.firstName} ${data.profile.lastName}`,
    }));

    return {
      pendingArticles: normalizedArticleData.map((item) => ({
        ...item,
      })),
      userData: normalizedJournalistData,
    };
  }
}
