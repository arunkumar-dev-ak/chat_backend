import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Receiver Id is required' })
  receiverId: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Content type is required' })
  content: string;
}
