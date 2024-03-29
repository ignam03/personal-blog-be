import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ErrorManager } from 'src/exceptions/error.manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { Patch } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

//@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('my-profile')
  @UseGuards(AuthGuard('jwt'))
  async fetchMyProfile(@Request() request): Promise<User> {
    return await this.usersService.fetchMyProfile(request.user.id);
  }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Request() request): Promise<User[]> {
    return await this.usersService.fetchAll();
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('userId') userId: number): Promise<User> {
    const user = await this.usersService.fetchById(userId);
    if (!user) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  }

  @Patch(':userId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('userId') userId: number,
    @Request() request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.update(request.user.id, updateUserDto, file);
  }

  @Delete(':userId')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('userId') userId: number): Promise<any> {
    const deleted = await this.usersService.remove(userId);
    if (deleted === 0) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return { success: true, message: 'User deleted' };
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.usersService.forgotPassword(body);
  }

  @Public()
  @Post('reset-password/:token')
  async newPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
  ) {
    return await this.usersService.newPassword(token, body);
    return true;
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Request() request, @Body() body: ChangePasswordDto) {
    const userId = request.user.id;
    const { newPassword, oldPassword } = body;
    return await this.usersService.updatePassword(
      userId,
      oldPassword,
      newPassword,
    );
  }
}
