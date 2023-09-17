import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Request } from 'express';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('/')
  create(@Body() createArticleDto: CreateArticleDto, @Req() request: Request) {
    console.log(request);
    return this.articlesService.create(createArticleDto);
  }

  @Get('/')
  fetchAll(@Req() request: Request): Promise<Article[]> {
    console.log(request.originalUrl);
    return this.articlesService.fetchAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.fetchById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.articlesService.remove(+id);
  }
}
