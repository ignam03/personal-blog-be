import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorManager } from 'src/exceptions/error.manager';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { compareHash, generateHash, generateId } from 'src/utils/utils';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private cloudinary: CloudinaryService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = await this.userRepository.create(createUserDto);
      if (!createUser) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User can not be created',
        });
      }
      return createUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      if (users.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Users not found',
        });
      }
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({ where: { id } });
      if (!user)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne<User>({
      where: { email },
      attributes: {
        exclude: [
          'firstName',
          'lastName',
          'birthDate',
          'biography',
          'gender',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      },
    });
    if (false && !user)
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'User not found',
      });
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      if (file) {
        const res = await this.cloudinary.uploadImage(file);
        updateUserDto.profileImage = res.url;
      }
      const user = await this.userRepository.findOne<User>({
        where: { id },
      });
      if (!user)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      const [numberOfAffectedRows, [updatedUser]] =
        await this.userRepository.update(
          { ...updateUserDto },
          { where: { id }, returning: true },
        );
      if (!updatedUser)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User can not be updated',
        });
      return { numberOfAffectedRows, updatedUser };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOne<User>({ where: { id } });
      if (!user)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      await this.userRepository.destroy({ where: { id: user.id } });
      return {
        success: true,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchMyProfile(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { id: id },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { id },
      });
      if (!user) {
        return null;
      }
      const match = await compareHash(oldPassword, user.password);
      if (!match) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Old password does not match',
        });
      }
      const newPasswordHashed = await generateHash(newPassword);
      const [numberOfAffectedRows, [updatedUser]] =
        await this.userRepository.update(
          {
            password: newPasswordHashed,
          },
          { where: { id }, returning: true },
        );
      if (!updatedUser)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User can not be updated',
        });
      return { numberOfAffectedRows, updatedUser };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    try {
      const { email } = forgotPassword;
      const user = await this.userRepository.findOne<User>({
        where: { email },
      });
      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      user.token = generateId();
      user.save();
      //send email to reset password
      this.mailService.sendPasswordReset(
        user.email,
        user.firstName,
        user.token,
      );
      return {
        success: true,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async fetchByToken(token: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne<User>({
        where: { token },
      });
      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async newPassword(token: string, body: ResetPasswordDto) {
    try {
      const { password } = body;
      const user = await this.fetchByToken(token);
      const newPasswordHashed = await generateHash(password);
      user.password = newPasswordHashed;
      user.token = '';
      user.save();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
