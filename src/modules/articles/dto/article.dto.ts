import { IsNotEmpty, MinLength } from 'class-validator';

export class ArticleDto {
  @IsNotEmpty()
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  description: string;
}
