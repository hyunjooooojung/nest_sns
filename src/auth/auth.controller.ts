import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginWithEmail(
    @Headers('authorization') rawToken: string,
    // @Body() body: { email: string, password: string },
  ){
    // Header에서 토큰 추출 후 Base64 디코딩하여 이메일과 비밀번호 추출
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWIthEmail({
      email: credentials.email,
      password: credentials.password,
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
