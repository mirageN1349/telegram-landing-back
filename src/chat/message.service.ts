import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { MessageCreateDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  private get select() {
    return {
      id: true,
      content: true,
      roomId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async findOne(id: Uuid): Promise<Message | null> {
    return this.prisma.message.findUnique({
      where: { id },
      select: this.select,
    });
  }

  async findManyByRoomId(roomId: Uuid): Promise<Message[] | null> {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      select: this.select,
    });
  }

  async create(dto: MessageCreateDto): Promise<Message | null> {
    return this.prisma.message.create({
      data: {
        content: dto.content,
        room: {
          connect: { id: dto.roomId },
        },
        user: {
          connect: { id: dto.userId },
        },
      },
      select: this.select,
    });
  }
}
