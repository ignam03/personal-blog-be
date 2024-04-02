import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorManager } from 'src/exceptions/error.manager';
import { ROLES } from 'src/constants/roles';
import { generateId } from 'src/utils/utils';
import { MailService } from '../mail/mail.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.develop.env',
});

const configService = new ConfigService();
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    try {
      const token = await this.generateToken(user);
      if (user.isActive == false) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Account not activated',
        });
      }
      return { user, token };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
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
      const myToken = generateId();
      const newUser = await this.usersService.create({
        ...user,
        token: myToken,
        role: ROLES.USER,
        isActive: false,
        password: pass,
      });

      const { password, ...result } = newUser['dataValues'];

      //generate Token
      const token = await this.generateToken(result);
      //send welcome email
      // emailRegister({
      //   email: user.email,
      //   token: myToken,
      //   name: user.firstName,
      // });

      //send welcome email
      await this.mailService.sendUserConfirmation(
        user.email,
        user.firstName,
        myToken,
      );

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

  public async confirmAccount(token: string) {
    try {
      const user = await this.usersService.fetchByToken(token);
      user.token = '';
      user.isActive = true;
      user.save();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async loginGoogle(body: any) {
    try {
      const client = new OAuth2Client(
        configService.get<string>('GOOGLE_CLIENT_ID'),
      );
      const ticket = await client.verifyIdToken({
        idToken: body.token,
        audience: configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      const userByEmail = await this.usersService.fetchByEmail(payload.email);
      if (userByEmail) {
        const { ...result } = userByEmail['dataValues'];
        const token = await this.generateToken(result);
        return { user: result, token };
      }
      const pass = await this.hashPassword(payload.email);
      const myToken = generateId();
      const user = {
        firstName: payload.name,
        userName: payload.family_name,
        email: payload.email,
        password: pass,
        token: myToken,
        role: ROLES.USER,
        isActive: true,
        externalProvider: true,
        provider: 'google',
        profileImage: payload.picture,
      };
      const newUser = await this.usersService.create({
        ...user,
      });

      const { password, ...result } = newUser['dataValues'];
      const token = await this.generateToken(result);
      return { user: result, token };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
