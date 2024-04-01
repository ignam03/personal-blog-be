import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @Public()
  async login(@Request() request) {
    return await this.authService.login(request.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Request() request): any {
    request.session = null;
    return { msg: 'Logged out' };
  }

  @Post('signup')
  @Public()
  async signup(@Body() body: RegisterDto) {
    return await this.authService.create(body);
  }

  @Get('confirm-account/:token')
  @Public()
  async confirmAccount(@Param('token') token: string) {
    return await this.authService.confirmAccount(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const token = await this.authService.create(req.user);
      res.cookie('token', token, {
        maxAge: 86400,
        sameSite: true,
        secure: false,
      });
      //res.redirect(`${FRONTEND_ENDPOINT}/oauth?token=${token.token}`);
      return res.status(HttpStatus.OK);
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  }

  @Post('/google')
  @Public()
  async googleLogin(@Request() req): Promise<any> {
    const { body } = req;
    return await this.authService.loginGoogle(body);
  }
}
