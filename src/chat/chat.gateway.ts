import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(4321, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('room', client.id + ' joined');
  }

  handleDisconnect(client: Socket) {
    client.emit('room', client.id + ' left!');
  }
  @SubscribeMessage('message')
  handleEvents(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // console.log(client);
    // return data;
    this.server.emit('room', `[${client.id}] -> ${data}`);
  }
}
