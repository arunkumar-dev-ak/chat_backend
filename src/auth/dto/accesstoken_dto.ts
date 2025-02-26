import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh Token should not be empty' })
  refreshToken: string;
}
