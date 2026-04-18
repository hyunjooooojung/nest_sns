import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat-dto";
import { ChatsService } from "./chats.service";
import { ChatsModel } from "./entity/chats.entity";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessageDto } from "./messages/dto/create-messages.dto";
import { ChatsMessagesService } from "./messages/messages.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection{
    constructor(
        private readonly chatsService: ChatsService,
        private readonly chatsMessagesService: ChatsMessagesService,
    ){

    }

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log(`on connect called: ${socket.id}`);
    }

    @SubscribeMessage('create_chat')
    async creatChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket,
    ): Promise<ChatsModel> {

        const chat = await this.chatsService.createChat(data);
        if(!chat){
            throw new Error('Chat not found');
        }
        socket.join(chat.id.toString());
        return chat;
    }

    @SubscribeMessage('enter_chat')
    async enterChat(
        @MessageBody() data: EnterChatDto,
        @ConnectedSocket() socket: Socket,
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

    // socket.on('seng_message', (message)=>{ console.log(message); });
    @SubscribeMessage('send_message')
    async sendMessage(
        @MessageBody() dto: CreateMessageDto,
        @ConnectedSocket() socket: Socket,
    ){
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
        if(!chatExists){
            throw new WsException({
                message: 'Chat not found',
                statusCode: 404,
            });
        }

        const message = await this.chatsMessagesService.createMessage(dto);
        // 1. 모든 사용자에게 메시지를 보내는 방법
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
        
        // 2. 특정 채팅방에만 메시지를 보내는 방법(broadcast)
        socket.to(message.id.toString()).emit('receive_message', message.message);
    }
}