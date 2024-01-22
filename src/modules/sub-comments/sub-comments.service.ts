import { Injectable, Inject } from '@nestjs/common';
import { CreateSubCommentDto } from './dto/create-sub-comment.dto';
import { UpdateSubCommentDto } from './dto/update-sub-comment.dto';
import { SubComment } from './entities/sub-comment.entity';
import { ErrorManager } from 'src/exceptions/error.manager';

@Injectable()
export class SubCommentsService {
  constructor(
    @Inject('SUB_COMMENT_REPOSITORY')
    private subCommentsRepository: typeof SubComment,
  ) {}
  async createSubComment(
    createSubCommentDto: CreateSubCommentDto,
    authorId: number,
  ): Promise<SubComment> {
    try {
      const subCommentCreated =
        await this.subCommentsRepository.create<SubComment>({
          ...createSubCommentDto,
          authorId,
        });
      if (!subCommentCreated) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'SubComment can not be created',
        });
      }
      return subCommentCreated;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  findAll() {
    return `This action returns all subComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subComment`;
  }

  update(id: number, updateSubCommentDto: UpdateSubCommentDto) {
    return `This action updates a #${id} subComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} subComment`;
  }

  async fetchSubCommentsByCommentId(commentId: number): Promise<SubComment[]> {
    console.log(commentId);
    try {
      const subComments = await this.subCommentsRepository.findAll<SubComment>({
        where: { commentId },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      if (subComments.length === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'SubComments not found',
        });
      return subComments;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
