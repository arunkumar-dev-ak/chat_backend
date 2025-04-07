import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseModule } from './response/response.module';
import { TokenModule } from './token/token.module';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ChatsseModule } from './chatsse/chatsse.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationwebsocketModule } from './conversationwebsocket/conversationwebsocket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './configs/app-options-constants';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    CacheModule.registerAsync(RedisOptions),
    AuthModule,
    PrismaModule,
    ResponseModule,
    TokenModule,
    ChatModule,
    UserModule,
    ChatsseModule,
    ConversationModule,
    ConversationwebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
  exports: [JwtService],
})
export class AppModule {}
