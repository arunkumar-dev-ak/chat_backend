import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseService } from './response/response.service';
import { ResponseModule } from './response/response.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { JwtService } from '@nestjs/jwt';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ChatsseController } from './chatsse/chatsse.controller';
import { ChatsseService } from './chatsse/chatsse.service';
import { ChatsseModule } from './chatsse/chatsse.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationwebsocketModule } from './conversationwebsocket/conversationwebsocket.module';
@Module({
  imports: [
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
  controllers: [
    AppController,
    ChatController,
    UserController,
    ChatsseController,
  ],
  providers: [
    AppService,
    PrismaService,
    ResponseService,
    TokenService,
    JwtService,
    ChatService,
    UserService,
    ChatsseService,
  ],
  exports: [JwtService],
})
export class AppModule {}
