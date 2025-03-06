import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto/message.dto';
import { ResponseService } from 'src/response/response.service';

interface SaveMessageDto {
  senderId: string;
  body: MessageDto;
}

@Injectable()
export class ConversationwebsocketService {
  constructor(
    private readonly response: ResponseService,
    private readonly prisma: PrismaService,
  ) {}

  async saveMessage({ senderId, body }: SaveMessageDto) {
    const { receiverId, content } = body;
    const initialDate = new Date();
    //1.check if senderId and receiverId are not same
    //2.check if senderId is valid
    //3.check if receiverId is valid
    //4.check if receiverId is in the contact of senderId else store it
    //5.check if the senderId is in the contact of receiverId else store it
    //6.check if there is an conversation between the senderId and receiverId else create it
    //7.then save the message

    //1
    if (senderId === receiverId) {
      throw new BadRequestException('Sender and receiver cannot be the same.');
    }
    const result = await this.prisma.$transaction(async (tx) => {
      //2,3
      const [sender, receiver] = await Promise.all([
        tx.user.findUnique({ where: { userId: senderId } }),
        tx.user.findUnique({ where: { userId: receiverId } }),
      ]);
      if (!sender) {
        throw new BadRequestException('Sender not found');
      }
      if (!receiver) {
        throw new BadRequestException('Receiver not found');
      }

      //4,5 create or update(none) on contact
      await Promise.all([
        tx.contact.upsert({
          where: {
            userId_contactId: { userId: senderId, contactId: receiverId },
          },
          update: {},
          create: {
            userId: senderId,
            contactId: receiverId,
          },
        }),
        tx.contact.upsert({
          where: {
            userId_contactId: { userId: receiverId, contactId: senderId },
          },
          update: {},
          create: {
            userId: receiverId,
            contactId: senderId,
          },
        }),
      ]);

      //6 create cnversation
      let conversation = await tx.conversation.findFirst({
        where: {
          OR: [
            { user1Id: senderId, user2Id: receiverId },
            { user1Id: receiverId, user2Id: senderId },
          ],
        },
      });
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            user1Id: senderId,
            user2Id: receiverId,
          },
        });
      }
      //7 save message
      const message = await tx.message.create({
        data: {
          senderId,
          receiverId,
          conversationId: conversation.id,
          content,
        },
      });
      //save last message id in conversation
      await tx.conversationMetaData.upsert({
        where: { conversationId: conversation.id },
        update: { lastMessageId: message.id },
        create: { conversationId: conversation.id, lastMessageId: message.id },
      });

      return message;
    });

    const processSeconds =
      (new Date().getTime() - initialDate.getTime()) / 1000;

    return {
      message: result,
      processSeconds,
    };
  }
}
