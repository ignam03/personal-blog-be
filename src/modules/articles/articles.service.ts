import { Injectable, Inject } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { ErrorManager } from 'src/exceptions/error.manager';
import { Comment } from '../comments/entities/comment.entity';
//import { col, fn } from 'sequelize';
import { getPagination, paginationData } from 'src/utils/utils';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: typeof Article,
  ) {}
  async create(
    createArticleDto: CreateArticleDto,
    authorId: number,
  ): Promise<Article> {
    try {
      const articleCreated = await this.articleRepository.create<Article>({
        ...createArticleDto,
        authorId,
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

  async fetchArticles(
    size?: number,
    page?: number,
  ): Promise<{
    articles: Article[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const { limit, offset } = getPagination(page, size);
      const articles: {
        rows: Article[];
        count: number;
      } = await this.articleRepository.findAndCountAll<Article>({
        offset: offset,
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
                'firstName',
                'lastName',
                'role',
                'gender',
                'birthDate',
                'email',
                'token',
              ],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'authorId'],
        },
        order: [['id', 'DESC']],
      });
      const response = paginationData(articles, page, size);
      return response;
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
                exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'authorId'],
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
      const article = await this.articleRepository.findOne<Article>({
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
                'firstName',
                'lastName',
                'role',
                'gender',
                'birthDate',
                'email',
              ],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'authorId'],
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

  async fetchArticlesByAuthorId(
    authorId: number,
    limit?: number,
  ): Promise<Article[]> {
    try {
      const articles: Article[] = await this.articleRepository.findAll<Article>(
        {
          where: { authorId },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
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
    authorId: number,
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
          { where: { id, authorId }, returning: true },
        );
      return { numberOfAffectedRows, updatedPost };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async remove(id: number, authorId: number): Promise<any> {
    try {
      const article = await this.articleRepository.findOne<Article>({
        where: { id, authorId },
      });
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'you can not delete article',
        });
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

  async fetchMyArticles(
    authorId: number,
    page?: number,
    size?: number,
  ): Promise<{
    articles: Article[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const { limit, offset } = getPagination(page, size);
      const articles: {
        rows: Article[];
        count: number;
      } = await this.articleRepository.findAndCountAll<Article>({
        offset: offset,
        limit: limit,
        where: { authorId },
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
                'firstName',
                'lastName',
                'role',
                'gender',
                'birthDate',
                'email',
              ],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
                'deletedAt',
                'authorId',
                'content',
                'parentCommentId',
                'articleId',
              ],
            },
            // include: [
            //   {
            //     model: User,
            //     as: 'author',
            //     attributes: ['id', 'userName'], // Adjust attributes as needed
            //   },
            // ],
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
        },
        order: [['id', 'DESC']],
      });

      // Extracting articles and pagination data
      const totalItems = articles.rows.length;
      const response = paginationData(articles, page, size, totalItems);
      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // async fetchMyArticles(
  //   authorId: number,
  //   page?: number,
  //   size?: number,
  // ): Promise<{
  //   articles: Article[];
  //   totalItems: number;
  //   currentPage: number;
  //   totalPages: number;
  // }> {
  //   try {
  //     const { limit, offset } = getPagination(page, size);
  //     const articles = await this.articleRepository.findAndCountAll<Article>({
  //       offset: offset,
  //       where: { authorId },
  //       attributes: {
  //         exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
  //         include: [[fn('COUNT', col('comments.id')), 'commentsCount']],
  //       },
  //       include: [
  //         {
  //           model: User,
  //           as: 'user',
  //           attributes: {
  //             exclude: [
  //               'password',
  //               'createdAt',
  //               'updatedAt',
  //               'deletedAt',
  //               'biography',
  //               'firstName',
  //               'lastName',
  //               'role',
  //               'gender',
  //               'birthDate',
  //               'email',
  //             ],
  //           },
  //         },
  //         {
  //           model: Comment,
  //           as: 'comments',
  //           attributes: {
  //             exclude: ['createdAt', 'updatedAt', 'authorId', 'deletedAt'],
  //           },
  //         },
  //       ],
  //       group: ['Article.id', 'user.id', 'comments.id'],
  //     });
  //     // console.log(articles);
  //     // if (articles.length === 0)
  //     //   throw new ErrorManager({
  //     //     type: 'NOT_FOUND',
  //     //     message: 'Articles not found',
  //     //   });
  //     const response = paginationData(articles, page, size);
  //     return response;
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }
}
