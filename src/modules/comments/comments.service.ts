import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ErrorManager } from 'src/exceptions/error.manager';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: typeof Comment,
    private readonly articleService: ArticlesService,
  ) {}
  async create(
    createCommentDto: CreateCommentDto,
    authorId: number,
  ): Promise<Comment> {
    try {
      const commentCreated = await this.commentRepository.create<Comment>({
        ...createCommentDto,
        authorId,
      });
      if (!commentCreated) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Comment can not be created',
        });
      }
      return commentCreated;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchAllComment(): Promise<Comment[]> {
    try {
      const comments: Comment[] = await this.commentRepository.findAll<Comment>(
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
              model: Article,
              as: 'article',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt'],
              },
            },
          ],
        },
      );
      if (!comments)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Comments not found',
        });
      return comments;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchAllCommentByArticle(articleId: number): Promise<Article> {
    try {
      const article = await this.articleService.findOne(articleId);
      // .include({
      //   model: Comment,
      //   as: 'comments',
      //   attributes: {
      //     exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
      //   },
      // });
      if (!article)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Comments not found',
        });
      return article;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchByCommentId(commentId: number): Promise<Comment> {
    {
      try {
        const comment = this.commentRepository.findOne({
          where: { id: commentId },
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
              model: Article,
              as: 'article',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'userId', 'deletedAt'],
              },
            },
          ],
        });
        if (!comment) {
          throw new ErrorManager({
            type: 'NOT_FOUND',
            message: 'Comment not found',
          });
        }
        return comment;
      } catch (error) {
        throw ErrorManager.createSignatureError(error.message);
      }
    }
  }
  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<any> {
    try {
      const comment = this.commentRepository.findOne<Comment>({
        where: { id: commentId },
      });
      if (!comment)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Comment not found update error',
        });
      // const commentUpd = {
      //   ...comment,
      //   ...updateCommentDto,
      // };
      const [numberOfAffectedRows, [updatedPost]] =
        await this.commentRepository.update(
          { ...updateCommentDto },
          { where: { id: commentId, authorId: userId }, returning: true },
        );
      return { numberOfAffectedRows, updatedPost };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async remove(id: number, userId: number): Promise<any> {
    try {
      const comment = await this.commentRepository.findOne<Comment>({
        where: { id, authorId: userId },
      });
      if (!comment)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Comment not found update error',
        });
      const deleteComment = await this.commentRepository.destroy({
        where: { id: comment.id },
      });
      if (!deleteComment)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Comment not found update error',
        });
      return {
        success: true,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
