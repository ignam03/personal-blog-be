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
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

//@UseGuards(AuthGuard('jwt'))
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() request,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto, request.user.id);
  }

  @Public()
  @Get('/')
  @ApiParam({
    name: 'limit',
  })
  async fetchArticles(
    @Request() request,
    @Query('limit') limit: number,
  ): Promise<Article[]> {
    return await this.articlesService.fetchArticles(limit);
  }

  @Get('/my-articles')
  @UseGuards(AuthGuard('jwt'))
  async fetchMyArticles(
    @Request() request,
    @Query('limit') limit: number,
  ): Promise<Article[]> {
    return await this.articlesService.fetchMyArticles(request.user.id, limit);
  }

  @Get(':articleId')
  @Public()
  async findOne(@Param('articleId') articleId: number): Promise<Article> {
    const article = await this.articlesService.fetchById(articleId);
    if (!article) {
      throw new HttpException('Article not found', 404);
    }
    return article;
  }

  @Put(':articleId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('articleId') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() request,
  ): Promise<Article> {
    return this.articlesService.update(
      articleId,
      updateArticleDto,
      request.user.id,
    );
  }

  @Delete(':articleId')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('articleId') articleId: number, @Request() request) {
    const deleted = await this.articlesService.remove(
      articleId,
      request.user.id,
    );
    if (deleted === 0) {
      throw new HttpException('Article not found', 404);
    }
    return { success: true, message: 'Article deleted' };
  }

  @Get('/user/:authorId')
  @ApiParam({
    name: 'authorId',
  })
  @UseGuards(AuthGuard('jwt'))
  async fetchByAuthorId(
    @Param('authorId') authorId: number,
    @Query('limit') limit: number,
  ): Promise<Article[]> {
    return this.articlesService.fetchArticlesByAuthorId(authorId, limit);
  }
}
