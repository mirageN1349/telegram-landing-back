import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMsgDto {
  @IsString()
  content: SomeString;

  @IsUUID()
  @IsOptional()
  senderId?: Uuid;
}
