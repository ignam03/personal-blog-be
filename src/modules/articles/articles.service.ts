import { Injectable, Inject, HttpException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof Article,
  ) {}
  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<Article> {
    try {
      const articleCreated = await this.articleRepository.create<Article>({
        ...createArticleDto,
        userId,
      });
      return articleCreated;
    } catch (error) {
      throw new Error(`Failed to create article: ${error.message}`);
    }
  }

  async fetchAll(): Promise<Article[]> {
    return await this.articleRepository.findAll<Article>({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });
  }

  async fetchById(id: number): Promise<Article> {
    const article = this.articleRepository.findOne<Article>({
      where: { id },
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });
    if (!article) throw new HttpException('Article not found', 404);
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<any> {
    const article = this.articleRepository.findOne<Article>({ where: { id } });
    if (!article) throw new HttpException('Article not found', 404);
    // const articleUpd = {
    //   ...article,
    //   ...updateArticleDto,
    // };
    const [numberOfAffectedRows, [updatedPost]] =
      await this.articleRepository.update(
        { ...updateArticleDto },
        { where: { id, userId }, returning: true },
      );
    return { numberOfAffectedRows, updatedPost };
  }

  async remove(id: number, userId: number): Promise<any> {
    const article = await this.articleRepository.findOne<Article>({
      where: { id, userId },
    });
    if (!article) throw new HttpException('Article not found', 404);
    await this.articleRepository.destroy({ where: { id: article.id } });
    return {
      success: true,
    };
  }
}
