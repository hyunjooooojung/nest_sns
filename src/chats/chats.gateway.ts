import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat-dto";
import { ChatsService } from "./chats.service";
import { ChatsModel } from "./entity/chats.entity";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessageDto } from "./messages/dto/create-messages.dto";
import { ChatsMessagesService } from "./messages/messages.service";
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";
import { SocketBearerTokenGuard } from "src/auth/guard/socket/socket-bearer-token.guard";
import { UsersModel } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly chatsMessagesService: ChatsMessagesService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ){

    }

    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log(`after gateway init`);
    }

    handleDisconnect(socket: Socket) {
        console.log(`on disconnect called : ${socket.id}`)
    }

    async handleConnection(socket: Socket & {user: UsersModel}) {
        console.log(`on connect called: ${socket.id}`);

        const headers = socket.handshake.headers;

        // Bearer xxxxxx
        const rawToken = headers['authorization'];
        
        if (!rawToken || Array.isArray(rawToken)) {
            socket.disconnect();
            return;
        }

        try {
            const token = this.authService.extractTokenFromHeader(
                rawToken,
                true,
            );
    
            const payload = this.authService.verifyToken(token);
            const user = await this.usersService.findUserByEmail(payload.email);

            if (!user) {
                throw new WsException('토큰이 유효하지 않습니다.');
            }

            socket.user = user;

            return true;
        } catch(e) {
            socket.disconnect();
        }
    }

    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }, // @Type(() => Number) 이 기능을 사용하지 않고도 자동으로 변환해준다.
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    @SubscribeMessage('create_chat')
    async creatChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ): Promise<ChatsModel> {

        const chat = await this.chatsService.createChat(data);
        if(!chat){
            throw new Error('Chat not found');
        }
        socket.join(chat.id.toString());
        return chat;
    }

    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }, // @Type(() => Number) 이 기능을 사용하지 않고도 자동으로 변환해준다.
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    @SubscribeMessage('enter_chat')
    async enterChat(
        @MessageBody() data: EnterChatDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ){
        for(const chatId of data.chatIds){
            const exists = await this.chatsService.checkIfChatExists(chatId);
            if(!exists){
                throw new WsException({
                    message: 'Chat not found',
                    statusCode: 404,
                })
            }
        }
        socket.join(data.chatIds.map((x) => x.toString()));
    }

    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }, // @Type(() => Number) 이 기능을 사용하지 않고도 자동으로 변환해준다.
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    // socket.on('seng_message', (message)=>{ console.log(message); });
    @SubscribeMessage('send_message')
    async sendMessage(
        @MessageBody() dto: CreateMessageDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ){
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
        if(!chatExists){
            throw new WsException({
                message: 'Chat not found',
                statusCode: 404,
            });
        }

        const message = await this.chatsMessagesService.createMessage(
            dto,
            socket.user.id,
        );
        // 1. 모든 사용자에게 메시지를 보내는 방법
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
        
        // 2. 특정 채팅방에만 메시지를 보내는 방법(broadcast)
        socket.to(message.id.toString()).emit('receive_message', message.message);
    }
}