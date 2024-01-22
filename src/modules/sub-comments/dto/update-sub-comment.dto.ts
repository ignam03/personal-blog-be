import { PartialType } from '@nestjs/swagger';
import { CreateSubCommentDto } from './create-sub-comment.dto';

export class UpdateSubCommentDto extends PartialType(CreateSubCommentDto) {}
