import { Module } from '@nestjs/common';
import { ConversationwebsocketService } from './conversationwebsocket.service';
import { ConversationwebsocketGateway } from './conversationwebsocket.gateway';
import { ChatsseService } from 'src/chatsse/chatsse.service';

@Module({
  providers: [
    ConversationwebsocketService,
    ConversationwebsocketGateway,
    ChatsseService,
  ],
})
export class ConversationwebsocketModule {}
