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
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entities/comment.entity';
import { ApiParam } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

//@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiParam({
    name: 'parentCommentId',
    type: Number,
    required: false,
  })
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() request,
    @Query('parentCommentId') parentCommentId: number,
  ) {
    return await this.commentsService.create(
      createCommentDto,
      request.user.id,
      parentCommentId,
    );
  }

  @Get()
  @ApiParam({
    name: 'limit',
    required: false,
  })
  @UseGuards(AuthGuard('jwt'))
  async fetchComments(
    @Request() request,
    @Query('limit') limit: number,
  ): Promise<Comment[]> {
    return await this.commentsService.fetchAllComment(limit);
  }

  @Get(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('commentId') commentId: number): Promise<Comment> {
    const comment = await this.commentsService.fetchByCommentId(commentId);
    if (!comment) {
      throw new HttpException('Comment not found', 404);
    }
    return comment;
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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

  @Get('/article/:articleId')
  @Public()
  async fetchCommentsByArticleId(
    @Param('articleId') articleId: number,
    @Query('limit') limit: number,
  ): Promise<Comment[]> {
    return await this.commentsService.fetchAllCommentByArticle(
      articleId,
      limit,
    );
  }

  @Get('/sub/:parentCommentId')
  @ApiParam({
    name: 'limit',
  })
  @UseGuards(AuthGuard('jwt'))
  async fetchSubComments(
    @Param('parentCommentId') parentCommentId: number,
    @Query('limit') limit?: number,
  ): Promise<Comment[]> {
    return await this.commentsService.fetchSubComments(parentCommentId, limit);
  }
}
