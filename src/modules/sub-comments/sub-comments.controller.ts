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
} from '@nestjs/common';
import { SubCommentsService } from './sub-comments.service';
import { CreateSubCommentDto } from './dto/create-sub-comment.dto';
import { UpdateSubCommentDto } from './dto/update-sub-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { SubComment } from './entities/sub-comment.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('sub-comments')
export class SubCommentsController {
  constructor(private readonly subCommentsService: SubCommentsService) {}

  @Post()
  create(@Body() createSubCommentDto: CreateSubCommentDto, @Request() request) {
    return this.subCommentsService.createSubComment(
      createSubCommentDto,
      request.user.id,
    );
  }

  @Get()
  findAll() {
    return this.subCommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCommentDto: UpdateSubCommentDto,
  ) {
    return this.subCommentsService.update(+id, updateSubCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCommentsService.remove(+id);
  }

  @Get('/commentId/:commentId')
  fetchSubCommentsByCommentId(
    @Param('commentId') commentId: number,
  ): Promise<SubComment[]> {
    return this.subCommentsService.fetchSubCommentsByCommentId(commentId);
  }
}
