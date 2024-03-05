import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ErrorManager } from 'src/exceptions/error.manager';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('my-profile')
  async fetchMyProfile(@Request() request): Promise<User> {
    return await this.usersService.fetchMyProfile(request.user.id);
  }

  @Get('/')
  async fetchAll(@Request() request): Promise<User[]> {
    return await this.usersService.fetchAll();
  }

  @Get(':userId')
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
  async update(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
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
}
