import { Controller, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatsseService } from './chatsse.service';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

interface AuthenticatedRequest extends Request {
  user: string;
}

interface MessageEventType {
  type: string;
  data: unknown;
}

@Controller('chatsse')
export class ChatsseController {
  constructor(
    private readonly chatService: ChatsseService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(AuthGuard)
  @Sse('conversation')
  sendEvents(@Req() req: AuthenticatedRequest): Observable<MessageEventType> {
    const userId: string = req.user;
    const stream = this.chatService.subscribeToUser({ userId });
    req.on('close', () => {
      this.chatService.unsubscribeUser(userId);
    });

    return stream;
  }

  @UseGuards(AuthGuard)
  @Sse('conversationByRedis')
  sendEventsByRedis(
    @Req() req: AuthenticatedRequest,
  ): Observable<MessageEventType> {
    const userId = req.user;
    const channel = `sse-user-${userId}`;

    return new Observable<MessageEventType>((subscriber) => {
      this.redisService
        .subscribe(channel, (message: string) => {
          const json: unknown = JSON.parse(message);
          const parsed = json as { event: string; data: unknown };

          subscriber.next({
            type: parsed.event,
            data: parsed.data,
          });
        })
        .catch((err) => {
          subscriber.error(err); // Optional: Handle Redis errors
        });
    });
  }
}
