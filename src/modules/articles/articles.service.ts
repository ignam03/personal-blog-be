import { Injectable, Inject, HttpException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { ErrorManager } from 'src/exceptions/error.manager';
import { Comment } from '../comments/entities/comment.entity';

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
      if (!articleCreated) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Article can not be created',
        });
      }
      return articleCreated;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchArticles(limit?: number): Promise<Article[]> {
    try {
      const articles: Article[] = await this.articleRepository.findAll<Article>(
        {
          limit: limit,
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: [
                  'password',
                  'createdAt',
                  'updatedAt',
                  'deletedAt',
                  'biography',
                  'lastName',
                  'role',
                  'gender',
                  'birthDate',
                ],
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
        },
      );
      if (articles.length === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Articles not found',
        });
      return articles;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchArticlesWithComments(limit?: number): Promise<Article[]> {
    try {
      const articles: Article[] = await this.articleRepository.findAll<Article>(
        {
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: [
                  'password',
                  'createdAt',
                  'updatedAt',
                  'deletedAt',
                  'biography',
                  'lastName',
                  'role',
                  'gender',
                  'birthDate',
                ],
              },
            },
            {
              model: Comment,
              as: 'comments',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
          limit: limit,
        },
      );
      if (articles.length === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Articles not found',
        });
      return articles;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchById(id: number): Promise<Article> {
    try {
      const article = this.articleRepository.findOne<Article>({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: [
                'password',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'biography',
                'lastName',
                'role',
                'gender',
                'birthDate',
              ],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId'],
        },
      });
      console.log(article);
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Article not found',
        });
      return article;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchArticlesByUserId(
    userId: number,
    limit?: number,
  ): Promise<Article[]> {
    try {
      const articles: Article[] = await this.articleRepository.findAll<Article>(
        {
          where: { userId },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
          },
          limit: limit,
        },
      );
      if (articles.length === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Articles not found',
        });
      return articles;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<any> {
    try {
      const article = this.articleRepository.findOne<Article>({
        where: { id },
      });
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Article not found update error',
        });
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
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async remove(id: number, userId: number): Promise<any> {
    try {
      const article = await this.articleRepository.findOne<Article>({
        where: { id, userId },
      });
      if (!article) throw new HttpException('Article not found', 404);
      const deleteArticle = await this.articleRepository.destroy({
        where: { id: article.id },
      });
      if (!deleteArticle) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Article not found update error',
        });
      }
      return {
        success: true,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOne(articleId: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne<Article>({
        where: { id: articleId },
      });
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Article not found',
        });
      return article;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchArticleWithComments(articleId: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne<Article>({
        where: { id: articleId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: [
                'password',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'biography',
                'lastName',
                'role',
                'gender',
                'birthDate',
              ],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId'],
        },
      });
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Article not found',
        });
      return article;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
