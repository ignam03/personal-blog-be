import { Injectable, Inject, HttpException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof Article,
  ) {}
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const articleCreated =
        await this.articleRepository.create(createArticleDto);
      return articleCreated;
    } catch (error) {
      throw new Error(`Failed to create article: ${error.message}`);
    }
  }

  async fetchAll(): Promise<Article[]> {
    return await this.articleRepository.findAll();
  }

  fetchById(id: number): Promise<Article> {
    const article = this.articleRepository.findOne<Article>({ where: { id } });
    if (!article) throw new HttpException('Article not found', 404);
    return article;
  }

  update(id: number, updateArticleDto: UpdateArticleDto): Promise<any> {
    const article = this.articleRepository.findOne<Article>({ where: { id } });
    if (!article) throw new HttpException('Article not found', 404);
    const articleUpd = {
      ...article,
      ...updateArticleDto,
    };
    return articleUpd;
  }

  async remove(id: number): Promise<any> {
    const article = await this.articleRepository.findOne<Article>({
      where: { id },
    });
    if (!article) throw new HttpException('Article not found', 404);
    await this.articleRepository.destroy({ where: { id: article.id } });
    return {
      success: true,
    };
  }
}
