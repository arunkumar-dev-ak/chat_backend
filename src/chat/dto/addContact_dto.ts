import { IsNotEmpty, IsString } from 'class-validator';

export class AddContactDto {
  @IsString()
  @IsNotEmpty({ message: 'ContactId should not be empty' })
  contactId: string;
}
