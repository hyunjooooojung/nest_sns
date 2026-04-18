import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log(`on connect called: ${socket.id}`);
    }

    // socket.on('seng_message', (message)=>{ console.log(message); });
    @SubscribeMessage('send_message')
    sendMessage(
        @MessageBody() message: string,
    ){
        console.log(`message received: ${message}`);
        this.server.emit('receive_message', message);
    }
}