import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatsseController } from './chatsse.controller';
import { ChatsseService } from './chatsse.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [ChatService, ChatsseService, JwtService],
  controllers: [ChatController, ChatsseController],
  exports: [ChatsseService],
})
export class ChatsseModule {}
