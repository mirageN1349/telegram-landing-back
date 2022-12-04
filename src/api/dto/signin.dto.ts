import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: Email;

  @IsString()
  password: SomeString;
}
