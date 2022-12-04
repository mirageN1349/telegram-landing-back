import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RoomCreateDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  private get select() {
    return {
      id: true,
      messages: true,
      users: true,
    };
  }

  async findOne(id: Uuid): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: { id },
      select: this.select,
    });
  }

  async create(dto: RoomCreateDto): Promise<Room | null> {
    const users = dto.userIds.map((id) => ({
      id,
    }));
    return this.prisma.room.create({
      data: {
        users: {
          connect: users,
        },
      },
      select: this.select,
    });
  }
}
