import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { FirebaseAdminProvider } from 'src/configs/firebase-options-constants';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseController],
  providers: [FirebaseService, FirebaseAdminProvider],
  exports: [FirebaseService],
})
export class FirebaseModule {}
