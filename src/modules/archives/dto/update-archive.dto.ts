import { PartialType } from '@nestjs/swagger';
import { CreateArchiveDto } from './create-archive.dto';

export class UpdateArchiveDto extends PartialType(CreateArchiveDto) {}
