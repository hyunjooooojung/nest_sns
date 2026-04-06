import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawToken = request.headers['authorization'];
        if(!rawToken) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const decoded = this.authService.verifyToken(token) as {
            email: string;
            sub: number;
            type: 'accessToken' | 'refreshToken';
        };
        
        const user = await this.usersService.findUserByEmail(decoded.email);

        request.user = user;
        request.token = decoded;
        request.tokenType = decoded.type;
        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isActivated = await super.canActivate(context);
        if(!isActivated) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        if (request.tokenType !== 'accessToken') {
            throw new UnauthorizedException('Access Token이 아닙니다.');
        }
        
        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isActivated = await super.canActivate(context);
        if(!isActivated) {
            return false;
        }
        
        
        const request = context.switchToHttp().getRequest();
        if (request.tokenType !== 'refreshToken') {
            throw new UnauthorizedException('Refresh Token이 아닙니다.');
        }
        
        return true;
    }
}