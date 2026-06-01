import { CanActivate, ExecutionContext } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";

export class SocketBearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket = context.switchToWs().getClient();
        
        const headers = socket.handshake.headers;

        // Bearer xxxxxx
        const rawToken = headers['authorization'];
        
        if(!rawToken) {
            throw new WsException('토큰이 없습니다.');
        }

        try{
            const token = this.authService.extractTokenFromHeader(
                rawToken,
                true,
            );
    
            const payload = this.authService.verifyToken(token);
            const user = await this.userService.findUserByEmail(payload.email);

            if (!user) {
                throw new WsException('토큰이 유효하지 않습니다.');
            }

            socket.user = user;
            socket.token = token;
            socket.tokenType = payload.tokenType;

            return true;
        } catch(e) {
        throw new WsException('토큰이 유효하지 않습니다.')
        }
    }
}