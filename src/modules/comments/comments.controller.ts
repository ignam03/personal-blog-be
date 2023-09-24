import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entities/comment.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() request) {
    console.log(request.user.id);
    return await this.commentsService.create(createCommentDto, request.user.id);
  }

  @Get()
  async findAll() {
    return await this.commentsService.fetchAllComment();
  }

  @Get(':commentId')
  async findOne(@Param('commentId') commentId: number): Promise<Comment> {
    const comment = await this.commentsService.fetchByCommentId(commentId);
    if (!comment) {
      throw new HttpException('Comment not found', 404);
    }
    return comment;
  }

  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() request,
  ) {
    return await this.commentsService.update(
      commentId,
      updateCommentDto,
      request.user.id,
    );
  }

  @Delete(':commentId')
  async remove(@Param('commentId') commentId: number, @Request() request) {
    const deleted = await this.commentsService.remove(
      commentId,
      request.user.id,
    );
    if (deleted === 0) {
      throw new HttpException('Comment not found', 404);
    }
    return { success: true, message: 'Comment deleted' };
  }

  // @Get('/article/:articleId')
  // async fetchCommentsByArticleId(
  //   @Param('articleId') articleId: number,
  // ): Promise<Article> {
  //   return await this.commentsService.fetchAllCommentByArticle(articleId);
  // }
}
