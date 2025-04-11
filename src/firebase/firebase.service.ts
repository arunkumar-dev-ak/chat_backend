import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private firebaseApp: app.App) {}

  async sendNotification(
    token: string, // FCM device token
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    const message = {
      data: {
        title,
        body,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        ...data,
      },
      token,
    };

    console.log(message);

    try {
      const response = await this.firebaseApp.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
