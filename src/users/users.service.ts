import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

export type SaveUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<SaveUser[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      omit: { password: true },
    });
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return !!user;
  }

  async userEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  async getUserById(id: string): Promise<SaveUser> {
    await this.userExists(id);

    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    }) as Promise<SaveUser>;
  }

  async getUserByEmail(email: string): Promise<SaveUser> {
    const exists = await this.userEmailExists(email);

    if (!exists) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    }) as Promise<SaveUser>;
  }

  async getUserPasswordByEmail(email: string): Promise<string> {
    const exists = await this.userEmailExists(email);

    if (!exists) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const user = (await this.prisma.user.findUnique({
      where: { email },
      select: { password: true },
    })) as { password: string };
    return user.password;
  }

  async createUser(data: CreateUserDto): Promise<SaveUser> {
    const exists = await this.userEmailExists(data.email);

    if (exists) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    return this.prisma.user.create({
      data,
      omit: { password: true },
    });
  }

  async updateUser(id: string, data: updateUserDto): Promise<SaveUser> {
    await this.userExists(id);

    return this.prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userExists(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
