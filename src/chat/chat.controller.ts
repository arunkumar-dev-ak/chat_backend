import {
  Body,
  Controller,
  Req,
  Res,
  UseGuards,
  Post,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'supertest';
import { ChatService } from './chat.service';
import { AddContactDto } from './dto/addContact_dto';

interface AuthenticatedRequest extends Request {
  user: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @UseGuards(AuthGuard)
  @Post('add')
  async addContact(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: AddContactDto,
  ) {
    const userId: string = req.user;
    return await this.chatService.addContact({ res, userId, body });
  }

  @UseGuards(AuthGuard)
  @Patch('remove')
  async removeContact(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: AddContactDto,
  ) {
    const userId: string = req.user;
    return await this.chatService.removeContact({ res, userId, body });
  }
}
