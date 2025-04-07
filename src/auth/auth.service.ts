import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response/response.service';
import { SignupDto } from './dto/signup_dto';
import { TokenService } from 'src/token/token.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login_dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly response: ResponseService,
    private readonly tokenService: TokenService,
  ) {}

  private array: string[] = [];

  /*----- signup -----*/
  async registerUser({
    req,
    res,
    user,
  }: {
    req: Request;
    res: Response;
    user: SignupDto;
  }) {
    const currentDate = new Date();
    //if existing email
    if (await this.checkUserByMail({ email: user.email })) {
      return this.response.errorResponse({
        res,
        message: 'Email already exists!',
        statusCode: 400,
      });
    }
    //if existing mobile no
    if (await this.checkUserByMobile({ mobileNo: user.mobileNo })) {
      return this.response.errorResponse({
        res,
        message: 'Mobile number already exists!',
        statusCode: 400,
      });
    }
    await this.prisma.$transaction(async (tx) => {
      const userInfo = {
        ...user,
        password: await bcrypt.hash(user.password, 10),
      };
      const newUser = await tx.user.create({ data: userInfo });
      // token generation
      const { accessToken, refreshToken } =
        await this.tokenService.generateTokenPair({
          tx,
          userId: newUser.userId,
          req: req,
        });
      const data = { ...newUser, accessToken, refreshToken };
      return this.response.successResponse({
        res,
        data: data,
        message: 'User registered successfully!',
        statusCode: 201,
        initialDate: currentDate,
      });
    });
  }

  /*----- login -----*/
  async login({
    req,
    credentials,
    res,
  }: {
    req: Request;
    credentials: LoginDto;
    res: Response;
  }) {
    const currentDate = new Date();
    // console.log(`before push array is ${this.array}`);
    this.array.push(credentials.email);
    // console.log(`after push array is ${this.array}`);

    const existingUser = await this.getUserByEmail({
      email: credentials.email,
    });

    if (!existingUser) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(
      credentials.password,
      existingUser.password,
    );
    if (!isMatch) throw new NotFoundException('Credentials do not match');

    //token generation
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokenPair({
        req,
        userId: existingUser.userId,
      });

    return this.response.successResponse({
      res: res,
      data: { ...existingUser, accessToken, refreshToken },
      message: 'Users data sended successfully',
      statusCode: 200,
      initialDate: currentDate,
    });
  }

  /*----- generate Refresh Token -----*/
  async generateAccessByRefreshToken({
    req,
    refreshToken,
    res,
  }: {
    req: Request;
    res: Response;
    refreshToken: string;
  }) {
    const initialDate = new Date();
    //check validity
    const data = await this.tokenService.validateRefreshToken({
      token: refreshToken,
    });
    //check user
    const user = await this.prisma.user.findUnique({
      where: { userId: data.userId },
    });
    //generate new token pair
    if (!user) throw new NotFoundException('User not found');
    const result = await this.prisma.$transaction(async (tx) => {
      const { accessToken, refreshToken } =
        await this.tokenService.generateTokenPair({
          req,
          userId: user.userId,
          tx,
        });

      await this.tokenService.revokeRefreshToken({ token: data.token, tx });

      return { accessToken, refreshToken };
    });

    return this.response.successResponse({
      res,
      data: { ...user, ...result },
      message: 'Access token generated successfully',
      statusCode: 200,
      initialDate,
    });
  }

  async checkUserByMail({ email }: { email: string }): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async getUserByEmail({ email }: { email: string }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async checkUserByMobile({
    mobileNo,
  }: {
    mobileNo: string;
  }): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { mobileNo } });
    return !!user;
  }
}
