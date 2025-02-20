import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseService } from './response/response.service';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [AuthModule, PrismaModule, ResponseModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ResponseService],
})
export class AppModule {}
