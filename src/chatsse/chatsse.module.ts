import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [AuthModule],
  providers: [ChatService, JwtService],
  controllers: [ChatController],
})
export class ChatsseModule {}
