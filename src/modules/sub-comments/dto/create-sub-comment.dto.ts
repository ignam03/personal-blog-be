import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateSubCommentDto {
  @IsNotEmpty()
  @MinLength(4)
  content: string;

  @IsNumber()
  commentId: number;
}
