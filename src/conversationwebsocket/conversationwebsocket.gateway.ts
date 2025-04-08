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
import { RedisService } from 'src/redis/redis.service';

interface SocketRequest extends Socket {
  user?: string;
}

@WebSocketGateway({ namespace: 'conversationWebSocket' })
@UseGuards(SocketGuard)
export class ConversationwebsocketGateway implements OnGatewayInit<Server> {
  constructor(
    private readonly webSocketService: ConversationwebsocketService,
    private readonly chatSseService: ChatsseService,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server): void {
    console.log('Initializing WebSocket Gateway...');
    server.use(SocketMiddleware);
  }

  handleConnection(client: Socket) {
    console.log(client.id);
    client.emit('room', client.id + ' joined');
  }

  handleDisconnection(client: Socket) {
    client.emit('room', client.id + ' left!');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { receiverId: string },
    @ConnectedSocket() client: SocketRequest,
  ) {
    const senderId = client.user;
    if (!senderId) {
      client.emit('error', 'Unauthorized');
      return;
    }

    const room =
      senderId < data.receiverId
        ? `chat-${senderId}-${data.receiverId}`
        : `chat-${data.receiverId}-${senderId}`;
    client.emit('joinedRoom', `User ${senderId} joined room ${room}`);
    await client.join(room);
    console.log(`User ${senderId} joined room ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() body: MessageDto,
    @ConnectedSocket() client: SocketRequest,
  ) {
    try {
      const senderId: string | undefined = client.user;
      const { receiverId, content } = body;

      if (!senderId) throw new WsException('Unauthorized');
      if (!content) throw new WsException('Content is required');
      if (!receiverId) throw new WsException('Receiver ID is required');

      const room =
        senderId < receiverId
          ? `chat-${senderId}-${receiverId}`
          : `chat-${receiverId}-${senderId}`;

      // Ensure client is in the room
      await client.join(room);

      //get sockets from room
      const socketsInRoom = await this.server.in('room-id').fetchSockets();
      console.log(socketsInRoom);

      const savedMessage = await this.webSocketService.saveMessage({
        senderId,
        receiverId,
        content,
      });

      // Send ack to sender
      client.emit('messageSent', savedMessage);

      // Emit via WebSocket if receiver is in room
      this.server.to(room).emit('newMessage', savedMessage);

      // Fallback: Notify receiver's contact list using SSE
      const channel = `sse-user-${receiverId}`;
      await this.redisService.publish(
        channel,
        JSON.stringify({
          event: 'newMessage',
          data: savedMessage,
        }),
      );
    } catch (err: any) {
      if (err instanceof WsException) throw err;
      throw new WsException(`Unable to send message: ${err}`);
    }
  }
}
