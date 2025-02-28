import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';
import { Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*----- Users -----*/
  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(@Res() res: Response) {
    return await this.userService.getAllUsers({ res });
  }

  /*----- Users by id -----*/
  @Get('getUserById')
  @UseGuards(AuthGuard)
  async getUsers(@Req() req: AuthenticatedRequest) {
    const userId: string = req.user;
    return await this.userService.getUserById({ userId });
  }
}
