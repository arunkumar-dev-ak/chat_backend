import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async generateTokenPair({
    req,
    userId,
    tx,
  }: {
    req: Request;
    userId: string;
    tx?: Prisma.TransactionClient | undefined;
  }) {
    const accessToken = await this.generateAccessToken({ userId });
    const refreshToken = await this.generateRefreshToken({ req, userId, tx });
    return { accessToken, refreshToken };
  }

  async generateAccessToken({ userId }: { userId: string }) {
    return await this.jwtService.signAsync(
      { sub: userId },
      { secret: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET' },
    );
  }

  async generateRefreshToken({
    tx,
    req,
    userId,
  }: {
    tx: Prisma.TransactionClient | undefined;
    req: Request;
    userId: string;
  }) {
    const userAgent = req.headers['user-agent'];
    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      { secret: process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET' },
    );
    await this.checkCountAndDeleteRefreshToken({ tx, userId });
    if (tx) {
      await tx.refreshToken.create({
        data: {
          userId,
          token: refreshToken,
          userAgent,
          expiresAt: expirationDate,
        },
      });
    } else {
      await this.prisma.refreshToken.create({
        data: {
          userId,
          token: refreshToken,
          userAgent,
          expiresAt: expirationDate,
        },
      });
    }
    return refreshToken;
  }

  async checkCountAndDeleteRefreshToken({
    tx,
    userId,
  }: {
    tx: Prisma.TransactionClient | undefined;
    userId: string;
  }) {
    const tokens = tx
      ? await tx.refreshToken.findMany({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        })
      : await this.prisma.refreshToken.findMany({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });
    if (tokens.length > (Number(process.env.REFRESH_TOKEN_LIMIT) || 10)) {
      if (tx) {
        await tx.refreshToken.delete({
          where: { id: tokens[0].id },
        });
      } else {
        await this.prisma.refreshToken.delete({
          where: { id: tokens[0].id },
        });
      }
    }
  }

  async validateRefreshToken({ token }: { token: string }) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET || 'RefreshTokenSecret',
      });

      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid token');
      }
      return refreshToken;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async revokeRefreshToken({
    token,
    tx,
  }: {
    token: string;
    tx: Prisma.TransactionClient;
  }) {
    await tx.refreshToken.delete({
      where: { token },
    });
  }
}
