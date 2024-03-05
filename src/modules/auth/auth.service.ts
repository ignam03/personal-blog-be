import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorManager } from 'src/exceptions/error.manager';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.fetchByEmail(username);
    if (!user) {
      return null;
    }

    //find password is same
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user['dataValues'];
    return result;
  }

  public async login(user) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user) {
    //hash password
    try {
      const userByEmail = await this.usersService.fetchByEmail(user.email);
      if (userByEmail)
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User already exists',
        });
      const pass = await this.hashPassword(user.password);

      const newUser = await this.usersService.create({
        ...user,
        role: ROLES.USER,
        password: pass,
      });

      const { password, ...result } = newUser['dataValues'];

      //generate Token
      const token = await this.generateToken(result);

      return { user: result, token };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
