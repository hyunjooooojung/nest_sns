import { Body, Controller, Headers, Post } from '@nestjs/common'; // Headers는 token/access, token/refresh에서 사용
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  rotateAccessToken(
    @Headers('authorization') rawToken: string) {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const newToken = this.authService.rotateToken(token, false);
      return {
        accessToken: newToken,
      }
    }
  
  @Post('token/refresh')
  rotateRefreshToken(
    @Headers('authorization') rawToken: string) {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const newToken = this.authService.rotateToken(token, true);
      return {
        refreshToken: newToken,
      }
    }

  /**
   * [로그인 방식 비교]
   *
   * 1) Basic Auth 방식
   *    - Authorization 헤더에 'Basic {base64(email:password)}' 형태로 전달
   *    - HTTP RFC 7617 표준에 정의된 방식
   *    - Base64는 암호화가 아니므로 반드시 HTTPS 사용 필요
   *    - 서버 간 통신이나 간단한 API 인증에 주로 사용
   *
   *    [구현 예시]
   *    @Post('login')
   *    loginWithEmail(@Headers('authorization') rawToken: string) {
   *      const token = this.authService.extractTokenFromHeader(rawToken, false);
   *      const credentials = this.authService.decodeBasicToken(token);
   *      return this.authService.loginWIthEmail(credentials);
   *    }
   *
   * 2) Body 방식 (실무에서 일반적인 방식)
   *    - POST body에 { email, password }를 JSON으로 전달
   *    - 대부분의 현대 REST API(모바일/SPA)에서 표준적으로 사용
   *    - Swagger/OpenAPI 문서화가 직관적
   *    - URL에 자격증명이 노출될 위험 없음
   */
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
