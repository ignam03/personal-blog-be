import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProviders } from './entities/user.providers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
})
export class UsersModule {}
