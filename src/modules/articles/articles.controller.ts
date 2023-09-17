import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() request,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async fetchAll(@Request() request): Promise<Article[]> {
    return this.articlesService.fetchAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article> {
    const article = this.articlesService.fetchById(id);
    if (!article) {
      throw new HttpException('Article not found', 404);
    }
    return article;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() request,
  ): Promise<Article> {
    return this.articlesService.update(id, updateArticleDto, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() request) {
    const deleted = await this.articlesService.remove(id, request.user.id);
    if (deleted === 0) {
      throw new HttpException('Article not found', 404);
    }
    return 'Article deleted';
  }
}
