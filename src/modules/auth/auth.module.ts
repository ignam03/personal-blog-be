import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';

ConfigModule.forRoot({
  envFilePath: '.develop.env',
});

const configService = new ConfigService();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<string>('TOKEN_EXPIRATION'),
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
