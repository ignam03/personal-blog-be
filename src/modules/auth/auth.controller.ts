import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register-user.dto';
import { Public } from 'src/decorators/public.decorator';

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
    request.session.destroy();
    return { msg: 'Logged out' };
  }

  @Post('signup')
  @Public()
  async signup(@Body() body: RegisterDto) {
    return await this.authService.create(body);
  }
}
