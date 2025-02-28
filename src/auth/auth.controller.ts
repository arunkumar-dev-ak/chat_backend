import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup_dto';
import { Response, Request } from 'express';
import { LoginDto } from './dto/login_dto';
import { AccessTokenDto } from './dto/accesstoken_dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*-----Signup -----*/
  @Post('register')
  @UsePipes(new ValidationPipe())
  async signUp(
    @Req() req: Request,
    @Body() signUpDto: SignupDto,
    @Res() res: Response,
  ) {
    return await this.authService.registerUser({
      req,
      res: res,
      user: signUpDto,
    });
  }

  /*----- Login -----*/
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Req() req: Request,
    @Body() signUpDto: LoginDto,
    @Res() res: Response,
  ) {
    return await this.authService.login({
      req,
      credentials: signUpDto,
      res,
    });
  }

  /*----- access token by refresh token -----*/
  @Post('accessToken')
  @UsePipes(new ValidationPipe())
  async generateAccessTokenByRefreshToken(
    @Req() req: Request,
    @Body() accessTokenDto: AccessTokenDto,
    @Res() res: Response,
  ) {
    return await this.authService.generateAccessByRefreshToken({
      req,
      refreshToken: accessTokenDto.refreshToken,
      res,
    });
  }
}
