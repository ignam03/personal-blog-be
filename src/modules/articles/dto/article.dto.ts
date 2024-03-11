import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ArticleDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty()
  readonly title: string;

  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty()
  readonly description: string;
}
