import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { ConversationwebsocketService } from './conversationwebsocket.service';
import { Req } from '@nestjs/common';
import { ChatsseService } from 'src/chatsse/chatsse.service';

interface AuthenticatedRequest extends Request {
  user: string;
}

@WebSocketGateway()
export class ConversationwebsocketGateway {
  constructor(
    private readonly webSocketService: ConversationwebsocketService,
    private readonly chatSseService: ChatsseService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('room', client.id + ' joined');
  }

  handleDisconnection(client: Socket) {
    client.emit('room', client.id + ' left!');
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId: string = req.user;
    const savedMessage = await this.webSocketService.saveMessage({
      senderId: userId,
      body,
    });
    client.emit('messageSent', savedMessage);
    const { receiverId } = body;
    //send last message in events if online
    if (this.chatSseService.isUserSubscribed({ userId: receiverId })) {
      this.chatSseService.sendEventToUser({
        userId: receiverId,
        event: 'newMessage',
        data: savedMessage,
      });
    } else {
      console.log(`User ${receiverId} is offline. Skipping SSE update.`);
    }

    // Emit message in WebSocket if receiver is actively chatting
    client.to(receiverId).emit('newMessage', savedMessage);
  }
}
