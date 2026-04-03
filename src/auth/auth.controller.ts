import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginWithEmail(
    @Body() body: { email: string, password: string },
  ){
    return this.authService.loginWIthEmail({
      email: body.email,
      password: body.password,
    });
  }

  @Post('register')
  registerWithEmail(
    @Body() body: { nickname: string, email: string, password: string },
  ){
    return this.authService.registerWithEmail({
      nickname: body.nickname,
      email: body.email,
      password: body.password,
    });
  }
}
