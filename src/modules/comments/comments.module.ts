import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { commentProviders } from './entities/comment.provider';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ...commentProviders],
  imports: [ArticlesModule],
})
export class CommentsModule {}
