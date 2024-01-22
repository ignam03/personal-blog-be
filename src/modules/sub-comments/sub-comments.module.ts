import { Module } from '@nestjs/common';
import { SubCommentsService } from './sub-comments.service';
import { SubCommentsController } from './sub-comments.controller';
import { subCommentProviders } from './entities/sub-comment.provider';

@Module({
  controllers: [SubCommentsController],
  providers: [SubCommentsService, ...subCommentProviders],
  exports: [SubCommentsService],
})
export class SubCommentsModule {}
