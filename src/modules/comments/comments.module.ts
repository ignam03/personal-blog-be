import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { commentProviders } from './entities/comment.provider';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ...commentProviders],
})
export class CommentsModule {}
