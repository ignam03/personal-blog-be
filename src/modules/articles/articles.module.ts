import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { articleProviders } from './entities/article.providers';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, ...articleProviders],
})
export class ArticlesModule {}
