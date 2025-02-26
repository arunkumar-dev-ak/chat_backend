import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup_dto';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginDto } from './dto/login_dto';
import { AccessTokenDto } from './dto/accesstoken_dto';

interface AuthenticatedRequest extends Request {
  user: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*----- Users info -----*/
  @Get('/users')
  @UseGuards(AuthGuard)
  async getUsers(@Req() req: AuthenticatedRequest) {
    const userId: string = req.user;
    return await this.authService.getUserById({ userId });
  }

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
