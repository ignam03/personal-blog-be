import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly oldPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly newPassword: string;
}
