import { Module } from '@nestjs/common';
import { ConversationwebsocketService } from './conversationwebsocket.service';
import { ConversationwebsocketGateway } from './conversationwebsocket.gateway';
import { JwtService } from '@nestjs/jwt';
import { ChatsseModule } from 'src/chatsse/chatsse.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [ChatsseModule, RedisModule],
  providers: [
    ConversationwebsocketService,
    ConversationwebsocketGateway,
    JwtService,
  ],
})
export class ConversationwebsocketModule {}
