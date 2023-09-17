import { Injectable, Inject, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = await this.userRepository.create(createUserDto);
    return createUser;
  }

  async fetchAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async fetchById(id: number): Promise<User> {
    const user = await this.userRepository.findOne<User>({ where: { id } });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async fetchByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne<User>({
      where: { email },
      attributes: {
        exclude: [
          'firstName',
          'lastName',
          'birthDate',
          'gender',
          'createdAt',
          'updatedAt',
        ],
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userRepository.findOne<User>({ where: { id } });
    if (!user) throw new HttpException('User not found', 404);
    const userUpdate = {
      ...user,
      ...updateUserDto,
    };
    return userUpdate;
  }

  async remove(id: number): Promise<any> {
    const user = await this.userRepository.findOne<User>({ where: { id } });
    if (!user) throw new HttpException('User not found', 404);
    await this.userRepository.destroy({ where: { id: user.id } });
    return {
      success: true,
    };
  }
}
