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
import { HttpCustomService } from 'src/providers/http/http.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly httpService: HttpCustomService,
  ) {}

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
  async fetchArticles(@Request() request): Promise<Article[]> {
    return this.articlesService.fetchArticles();
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  async fetchByUserId(@Param('id') id: number): Promise<Article[]> {
    return this.articlesService.fetchByUserId(id);
  }

  @Get('api/all')
  async fetchAll(): Promise<Article[]> {
    return this.httpService.apiFetchAll();
  }
}
