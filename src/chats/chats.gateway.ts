import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat-dto";
import { ChatsService } from "./chats.service";
import { ChatsModel } from "./entity/chats.entity";
import { EnterChatDto } from "./dto/enter-chat.dto";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection{
    constructor(
        private readonly chatsService: ChatsService,
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
    sendMessage(
        @MessageBody() message:{message: string, chatId: number},
        @ConnectedSocket() socket: Socket,
    ){
        console.log(`message received: ${message}`);
        // 1. 모든 사용자에게 메시지를 보내는 방법
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);
        
        // 2. 특정 채팅방에만 메시지를 보내는 방법(broadcast)
        socket.to(message.chatId.toString()).emit('receive_message', message.message);
    }
}