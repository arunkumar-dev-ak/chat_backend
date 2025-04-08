import { IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  senderId: string;
  receiverId: string;
}
