import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
  ) {}

  async getConversationById({
    res,
    user1Id,
    user2Id,
  }: {
    res: Response;
    user1Id: string;
    user2Id: string;
  }) {
    const initialDate = new Date();
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
        NOT: {
          hiddenForUserIds: {
            has: user1Id,
          },
        },
      },
      include: {
        message: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return this.response.successResponse({
      res,
      data: conversation,
      message: 'Conversation fetched successfully!',
      statusCode: 200,
      initialDate,
    });
  }
}
