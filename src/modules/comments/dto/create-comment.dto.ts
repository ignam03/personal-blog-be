import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MinLength(4)
  content: string;

  @IsNumber()
  articleId: number;
}
