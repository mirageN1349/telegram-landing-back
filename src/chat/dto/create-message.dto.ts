import { IsString, IsUUID } from 'class-validator';

export class MessageCreateDto {
  @IsUUID()
  roomId: Uuid;

  @IsUUID()
  userId: Uuid;

  @IsString()
  content: SomeString;
}
