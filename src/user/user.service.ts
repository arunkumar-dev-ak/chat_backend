import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
  ) {}

  async getAllUsers({ res }: { res: Response }) {
    const initialDate = new Date();
    const user = await this.prisma.user.findMany();
    return this.response.successResponse({
      res,
      message: 'Data fetched successfully',
      statusCode: 200,
      data: user,
      initialDate,
    });
  }

  async getUserById({ userId }: { userId: string }) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    return user;
  }
}
