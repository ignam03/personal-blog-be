import { PartialType } from '@nestjs/swagger';
import { CreateSharedDto } from './create-shared.dto';

export class UpdateSharedDto extends PartialType(CreateSharedDto) {}
