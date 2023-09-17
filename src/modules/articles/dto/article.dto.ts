import { IsNotEmpty, MinLength } from 'class-validator';

export class ArticleDto {
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @IsNotEmpty()
  @MinLength(4)
  readonly description: string;
}
