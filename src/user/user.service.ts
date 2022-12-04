import { Injectable } from '@nestjs/common';
import { role_key, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private get select() {
    return {
      id: true,
      email: true,
      password: false,
      roles: true,
      rooms: true,
    };
  }

  async findOne(id: Uuid) {
    if (!id) return null;
    return this.prisma.user.findUnique({
      where: { id },
      select: this.select,
    });
  }

  async findManyByRole(role: role_key): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { roles: { where: { key: role } } },
    });
  }

  async findManyByRoomId(roomId: Uuid): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { rooms: { where: { id: roomId } } },
    });
  }

  async findOneByEmail(email: Email): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { ...this.select, password: true },
    });
  }

  async create({
    roleKey,
    ...dto
  }: UserCreateDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.create({
      data: { ...dto, roles: { connect: { key: roleKey } } },
      select: this.select,
    });
  }

  async update(dto: UserUpdateDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.update({
      data: dto,
      where: { id: dto.id },
      select: this.select,
    });
  }
}
