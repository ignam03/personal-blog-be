import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProviders } from './entities/user.providers';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
  exports: [UsersService],
  imports: [CloudinaryModule],
})
export class UsersModule {}
