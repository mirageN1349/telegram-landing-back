import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { MessageService } from './message.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [RoomService, MessageService, PrismaService],
  exports: [RoomService, MessageService],
})
export class ChatModule {}
