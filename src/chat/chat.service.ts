import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';
import { AddContactDto } from './dto/addContact_dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
  ) {}
  async addContact({
    res,
    userId,
    body,
  }: {
    res: Response;
    userId: string;
    body: AddContactDto;
  }) {
    const { contactId } = body;
    const initialDate = new Date();
    const result = await this.prisma.$transaction(async (tx) => {
      //check two user ids are same
      if (userId === contactId) {
        throw new BadRequestException('Cannot add yourself as a contact');
      }

      // Check if user1 exists
      const user1 = await tx.user.findUnique({ where: { userId } });
      if (!user1) {
        throw new NotFoundException('User not found');
      }

      // Check if user2 (contact) exists
      const user2 = await tx.user.findUnique({ where: { userId: contactId } });
      if (!user2) {
        throw new NotFoundException('Contact not found');
      }

      // Check if the contact is already in the list
      const existingContact = await tx.contact.findFirst({
        where: {
          userId,
          contactId,
        },
      });
      if (existingContact) {
        throw new BadRequestException('Contact already exists in the list');
      }

      //adding contact
      return await tx.contact.create({
        data: {
          userId,
          contactId,
        },
        include: {
          user: true,
          contact: true,
        },
      });
    });

    return this.response.successResponse({
      res,
      data: result,
      message: 'Contact added successfully',
      statusCode: 200,
      initialDate,
    });
  }

  async removeContact({
    res,
    userId,
    body,
  }: {
    res: Response;
    userId: string;
    body: AddContactDto;
  }) {
    const initialDate = new Date();
    const result = await this.prisma.$transaction(async (tx) => {
      const { contactId } = body;

      // Check if the contact exists
      const contact = await tx.contact.findFirst({
        where: { userId, contactId },
      });
      if (!contact) {
        throw new BadRequestException('Contact not found in the list');
      }

      // Remove the contact
      await tx.contact.delete({ where: { id: contact.id } });

      // Find the conversation between the users
      const conversation = await tx.conversation.findFirst({
        where: {
          OR: [
            { user1Id: userId, user2Id: contactId },
            { user1Id: contactId, user2Id: userId },
          ],
        },
      });

      // If conversation exists, update it
      if (conversation) {
        const hiddenForUserIds: string[] = Array.isArray(
          conversation?.hiddenForUserIds,
        )
          ? conversation.hiddenForUserIds
          : [];

        //if contactId peresent delete the whole conversation which will delete message
        if (hiddenForUserIds.includes(contactId)) {
          await tx.conversation.delete({ where: { id: conversation.id } });
        }

        // If user is not already in hiddenForUserIds, update it
        if (!hiddenForUserIds.includes(userId)) {
          await tx.conversation.update({
            where: { id: conversation.id },
            data: {
              hiddenForUserIds: {
                set: [...hiddenForUserIds, userId],
              },
            },
          });
        }
      }

      return contact;
    });

    return this.response.successResponse({
      res,
      data: result,
      message: 'Contact removed successfully', // ✅ Fixed response message
      statusCode: 200,
      initialDate,
    });
  }

  async getAllConversation({ res, userId }: { res: Response; userId: string }) {
    const initialDate = new Date();
    const conversationList = await this.prisma
      .$queryRaw`SELECT c.id as conversationId,c.user1Id,c.user2Id,cm.lastMessageId,cm.lastMessageCreatedAt,m.* FROM Conversation c JOIN ConversationMetaData cm ON c.id = cm.conversationId JOIN Message m ON cm.lastMessageId = m.id WHERE c.user1Id = ${userId} OR c.user2Id = ${userId} ORDER BY cm.lastMessageCreatedAt DESC`;

    return this.response.successResponse({
      res,
      statusCode: 200,
      message: 'Conversation fetched successfully',
      data: conversationList,
      initialDate,
    });
  }
}
