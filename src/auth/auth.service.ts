import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';
import { SignupDto } from './dto/signup_dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
  ) {}
  async registerUser({ res, user }: { res: Response; user: SignupDto }) {
    const currentDate = new Date();
    try {
      const newUser = await this.prisma.user.create({ data: user });
      return this.response.successResponse({
        res,
        data: newUser,
        message: 'User registered successfully!',
        statusCode: 201,
        initialDate: currentDate,
      });
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';

      if (err instanceof Error) {
        message = err.message;
      }
      return this.response.errorResponse({
        res,
        message: message,
        statusCode: 500,
        initialDate: currentDate,
      });
    }
  }

  async getUserById() {}

  async getUserByEmail() {}
}
