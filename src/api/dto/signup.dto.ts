import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: Email;

  @IsString()
  @Length(8, 64)
  password: SomeString;
}
