import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
