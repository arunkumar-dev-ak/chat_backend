import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  // ?=   => positive lookahead it searches the entire string
  //  .   => Matches any char except new lines
  //  *?  => lazy quantifier checks as much as minimum elements
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and must be longer than 8 characters.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Mobile Number should be greater than or equat to 8',
  })
  mobileNo: string;
}
