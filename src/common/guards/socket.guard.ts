import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface SocketRequest extends Socket {
  user?: any;
}

interface payloadType {
  sub: string;
}

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('in socket guard');
    if (context.getType() !== 'ws') {
      return false;
    }

    const socket = context.switchToWs().getClient<SocketRequest>();

    const token = SocketGuard.extractToken(socket);
    if (!token) {
      throw new WsException('No token provided');
    }

    try {
      const payload: payloadType = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
      });
      socket.user = payload.sub;
    } catch {
      throw new WsException('Invalid token');
    }
    return true;
  }

  static extractToken(socket: Socket): string | undefined {
    const headerToken = socket.handshake.headers.authorization;
    const [type, token] = headerToken?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  static async validateToken(socket: Socket, jwtService: JwtService) {
    const token = this.extractToken(socket);

    if (!token) {
      return null;
    }

    try {
      const payload: payloadType = await jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
      });
      return payload.sub; // Return the user ID
    } catch {
      console.error('in Catch block returning null');
      return null;
    }
  }
}
