import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { ConversationwebsocketService } from './conversationwebsocket.service';
import { UseGuards } from '@nestjs/common';
import { SocketGuard } from 'src/common/guards/socket.guard';
import { SocketMiddleware } from 'src/common/middleware/socket.middleware';
import { ChatsseService } from 'src/chatsse/chatsse.service';

interface SocketRequest extends Socket {
  user?: string;
}

@WebSocketGateway({ namespace: 'conversationWebSocket' })
@UseGuards(SocketGuard)
export class ConversationwebsocketGateway implements OnGatewayInit<Server> {
  constructor(
    private readonly webSocketService: ConversationwebsocketService,
    private readonly chatSseService: ChatsseService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server): void {
    console.log('Initializing WebSocket Gateway...');
    server.use(SocketMiddleware);
  }

  handleConnection(client: Socket) {
    client.emit('room', client.id + ' joined');
  }

  handleDisconnection(client: Socket) {
    client.emit('room', client.id + ' left!');
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: SocketRequest,
  ) {
    try {
      const userId: string | undefined = client.user;
      if (!userId) {
        return client.emit('error', 'Unauthorized');
      }
      if (!body.content) {
        throw new WsException('Content is required');
      }
      if (!body.receiverId) {
        throw new WsException('Receiver Id is required');
      }

      const savedMessage = await this.webSocketService.saveMessage({
        senderId: userId,
        receiverId: body.receiverId,
        content: body.content,
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
      client.to(`${userId}-${receiverId}`).emit('newMessage', savedMessage);
    } catch (err: any) {
      if (err instanceof WsException) {
        throw err;
      }
      throw new WsException(`Unable to connect to client ${err}`);
    }
  }
}
