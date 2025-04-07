import { JwtService } from '@nestjs/jwt';
import { SocketGuard } from '../guards/socket.guard';
import { Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';

interface SocketRequest extends Socket {
  user?: any;
}
const jwtService = new JwtService(); // You might need to inject this properly if using NestJS DI

export const SocketMiddleware = (
  socket: SocketRequest,
  next: (err?: Error) => void,
) => {
  console.log('in socketMiddleware');
  SocketGuard.validateToken(socket, jwtService)
    .then((user) => {
      if (!user) {
        // console.log('in not user');
        return next(new UnauthorizedException('Unauthorized'));
      }

      socket.user = user; // Attach user info to socket
      next();
    })
    .catch((error) => {
      console.error('Socket auth error:', error);
      next(new Error('Internal Server Error'));
    });
};
