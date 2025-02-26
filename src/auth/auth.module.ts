import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, AuthGuard, JwtService],
  controllers: [AuthController],
  imports: [TokenModule],
})
export class AuthModule {}
