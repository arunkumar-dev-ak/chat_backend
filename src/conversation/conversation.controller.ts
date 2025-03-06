import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: string;
}

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Get('/conversation/:user2Id')
  async getConversation(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('user2Id') user2Id: string,
  ) {
    const userId: string = req.user;
    return await this.conversationService.getConversationById({
      res,
      user1Id: userId,
      user2Id,
    });
  }
}
