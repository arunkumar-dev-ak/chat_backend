import { Module } from '@nestjs/common';
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

@Module({
  imports: [AuthModule, PrismaModule, ResponseModule, TokenModule, ChatModule],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    PrismaService,
    ResponseService,
    TokenService,
    JwtService,
    ChatService,
  ],
})
export class AppModule {}
