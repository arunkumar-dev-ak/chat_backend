import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('notify')
  async sendNotification(
    @Body()
    body: {
      token: string | undefined;
      title: string | undefined;
      message: string | undefined;
      senderId: string;
      receiverId: string;
    },
  ) {
    const { token, title, message, senderId, receiverId } = body;
    await this.firebaseService.sendNotification(
      token || '',
      title || '',
      message || '',
      { senderId, receiverId },
    );
    return { success: true };
  }
}
