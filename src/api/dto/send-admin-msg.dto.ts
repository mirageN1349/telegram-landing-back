import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SendAdminMsgDto {
  @IsUUID()
  @IsOptional()
  roomId: Uuid;

  @IsString()
  content: SomeString;

  @IsUUID()
  senderId: Uuid;
}
