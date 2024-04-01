import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

ConfigModule.forRoot({
  envFilePath: '.develop.env',
});

const configService = new ConfigService();
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    //@Inject(User) private userRepository: Repository<User>
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      externalProvider: true,
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      password: `${emails[0].value}+google`,
      isActive: true,
      firstName: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    };
    done(null, user);
    //     const user = await this.userRepository.findOne({
    //       where: { email: profile.emails[0].value },
    //     });
    //     if (user) {
    //       return user;
    //     } else {
    //       const newUser = await this.userRepository.create({
    //         email: profile.emails[0].value,
    //         name: profile.displayName,
    //       });
    //       return newUser;
    //     }
    //   }
  }
}
