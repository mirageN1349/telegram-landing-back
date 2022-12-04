import { Role, role_key } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  @IsOptional()
  email?: Email;

  @IsString()
  @IsOptional()
  @Length(8, 64)
  password?: SomeString;

  @IsEnum(role_key)
  roleKey: role_key;
}
