/**
 * Basic
 *
 * 1) request를 불러오고 authorization header로부터 토큰을 가져온다.
 * 2) authService.extractTokenFromHeader()를 통해 토큰을 추출한다.
 * 3) authService.decodeBasicToken()를 통해 토큰을 디코딩한다.(email, password 추출)
 * 4) authService.authenticateWithEmailAndPassword()를 통해 사용자 검증을 진행한다.
 * 5) 검증이 완료되면 request를 진행한다.
 */

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const rawToken = request.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    const user =
      await this.authService.authenticateWithEmailAndPassword(credentials);

    request.user = user;
    return true;
  }
}
