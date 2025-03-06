import { Controller, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatsseService } from './chatsse.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: string;
}

interface MessageEventType {
  type: string;
  data: unknown;
}

@Controller('chatsse')
export class ChatsseController {
  constructor(private readonly chatService: ChatsseService) {}

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
}
